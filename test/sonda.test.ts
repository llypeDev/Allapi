import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import type { Endpoint, Servico } from "../src/catalogo.ts";
import { analisarOpenApi, analisarWsdl, sondarComRepeticao, sondarEndpoint, urlContrato } from "../src/sonda.ts";

const WSDL = `<?xml version="1.0"?>
<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://exemplo/ws">
  <wsdl:portType name="P"><wsdl:operation name="nfeStatusServicoNF"/></wsdl:portType>
  <wsdl:binding name="B" type="P"><wsdl:operation name="nfeStatusServicoNF"/></wsdl:binding>
</wsdl:definitions>`;

function servico(protocolo: Servico["protocolo"] = "soap"): Servico {
  return {
    id: "teste.nfe.status",
    item: "documentos_fiscais.nfe",
    nome: "Status",
    protocolo,
    autenticacao: "certificado_icp",
    endpoints: [],
    origem: { tipo: "memoria", registrado_em: "2026-01-01" },
  };
}

const ep = (url: string): Endpoint => ({ ambiente: "producao", url });

function responder(req: http.IncomingMessage, res: http.ServerResponse): void {
  const u = new URL(req.url ?? "/", "http://x");
  if (u.pathname === "/ws/status.asmx" && u.search.toLowerCase() === "?wsdl") {
    res.writeHead(200, { "content-type": "text/xml" }).end(WSDL);
  } else if (u.pathname === "/ws/status.asmx") {
    res.writeHead(200, { "content-type": "text/html" }).end("<html>página de ajuda</html>");
  } else if (u.pathname === "/negado") {
    res.writeHead(403).end("403.7 - Client certificate required");
  } else if (u.pathname === "/antigo") {
    res.writeHead(302, { location: "/ws/status.asmx?wsdl" }).end();
  } else {
    res.writeHead(404).end();
  }
}

const escutar = (s: http.Server | https.Server) =>
  new Promise<number>((ok) => s.listen(0, "127.0.0.1", () => ok((s.address() as AddressInfo).port)));

describe("contratos", () => {
  it("reconhece WSDL e lista as operações sem repetir", () => {
    assert.deepEqual(analisarWsdl(WSDL), { operacoes: ["nfeStatusServicoNF"] });
    assert.equal(analisarWsdl("<html><body>definitions</body></html>"), null);
  });

  it("reconhece OpenAPI em JSON", () => {
    assert.deepEqual(analisarOpenApi('{"openapi":"3.0.0","paths":{"/b":{},"/a":{}}}'), { operacoes: ["/a", "/b"] });
    assert.equal(analisarOpenApi('{"paths":{}}'), null);
    assert.equal(analisarOpenApi("<xml/>"), null);
  });

  it("deriva a URL do contrato conforme o protocolo", () => {
    assert.equal(urlContrato(servico(), ep("https://h/ws/a.asmx")), "https://h/ws/a.asmx?wsdl");
    assert.equal(urlContrato(servico("portal"), ep("https://h/consulta")), null);
    assert.equal(urlContrato(servico(), { ...ep("https://h/a"), contrato: { tipo: "nenhum" } }), null);
    assert.equal(urlContrato(servico("rest"), { ...ep("https://h/api"), contrato: { tipo: "openapi", url: "https://h/openapi.json" } }), "https://h/openapi.json");
  });
});

describe("sonda em HTTP", () => {
  let servidor: http.Server;
  let base: string;
  before(async () => {
    servidor = http.createServer(responder);
    base = `http://127.0.0.1:${await escutar(servidor)}`;
  });
  after(() => servidor.close());

  it("obtém o contrato e registra hash e operações", async () => {
    const { resultado, corpoContrato } = await sondarEndpoint(servico(), ep(`${base}/ws/status.asmx`));
    assert.equal(resultado.diagnostico, "contrato_obtido");
    assert.equal(resultado.responde, true);
    assert.deepEqual(resultado.contrato?.operacoes, ["nfeStatusServicoNF"]);
    assert.match(resultado.contrato?.sha256 ?? "", /^[0-9a-f]{64}$/);
    assert.equal(corpoContrato?.toString(), WSDL);
  });

  it("segue redirecionamento até o contrato", async () => {
    const s = servico();
    const { resultado } = await sondarEndpoint(s, { ...ep(`${base}/antigo`), contrato: { tipo: "wsdl", url: `${base}/antigo` } });
    assert.equal(resultado.diagnostico, "contrato_obtido");
  });

  it("classifica 403 como acesso negado, com o servidor respondendo", async () => {
    const { resultado } = await sondarEndpoint(servico(), { ...ep(`${base}/negado`), contrato: { tipo: "wsdl", url: `${base}/negado` } });
    assert.equal(resultado.diagnostico, "acesso_negado");
    assert.equal(resultado.responde, true);
    assert.equal(resultado.status_http, 403);
  });

  it("classifica 404 como não encontrado", async () => {
    const { resultado } = await sondarEndpoint(servico(), ep(`${base}/nao-existe.asmx`));
    assert.equal(resultado.diagnostico, "nao_encontrado");
  });

  it("não confunde página HTML com contrato", async () => {
    const { resultado } = await sondarEndpoint(servico("portal"), ep(`${base}/ws/status.asmx`));
    assert.equal(resultado.diagnostico, "http_200_sem_contrato");
    assert.equal(resultado.contrato, undefined);
  });

  it("registra falha de DNS sem lançar", async () => {
    const { resultado } = await sondarEndpoint(servico(), ep("https://host-que-nao-existe.invalid/ws/a.asmx"));
    assert.equal(resultado.diagnostico, "dns_falhou");
    assert.equal(resultado.responde, false);
  });

  it("registra porta fechada como conexão recusada", async () => {
    const livre = http.createServer();
    const porta = await escutar(livre);
    await new Promise((ok) => livre.close(ok));
    const { resultado } = await sondarEndpoint(servico(), ep(`http://127.0.0.1:${porta}/a.asmx`));
    assert.equal(resultado.diagnostico, "conexao_recusada");
    assert.equal(resultado.responde, false);
  });
});

describe("sonda em TLS", () => {
  let dir: string;
  let chave: Buffer;
  let cert: Buffer;
  const servidores: https.Server[] = [];

  before(() => {
    dir = mkdtempSync(join(tmpdir(), "sonda-tls-"));
    execFileSync(
      "openssl",
      ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "2", "-subj", "/CN=127.0.0.1",
        "-addext", "subjectAltName=IP:127.0.0.1", "-keyout", join(dir, "k.pem"), "-out", join(dir, "c.pem")],
      { stdio: "ignore" },
    );
    chave = readFileSync(join(dir, "k.pem"));
    cert = readFileSync(join(dir, "c.pem"));
  });
  after(() => {
    for (const s of servidores) s.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it("aceita cadeia fora do repositório público e registra isso", async () => {
    const s = https.createServer({ key: chave, cert }, responder);
    servidores.push(s);
    const porta = await escutar(s);
    const { resultado } = await sondarEndpoint(servico(), ep(`https://127.0.0.1:${porta}/ws/status.asmx`));
    assert.equal(resultado.diagnostico, "contrato_obtido");
    assert.equal(resultado.tls?.cadeia_publica, false);
    assert.ok(resultado.tls?.erro_cadeia);
    assert.equal(resultado.tls?.sujeito, "127.0.0.1");
  });

  it("reconhece servidor que exige certificado de cliente", async () => {
    const s = https.createServer({ key: chave, cert, requestCert: true, rejectUnauthorized: true, ca: cert }, responder);
    servidores.push(s);
    const porta = await escutar(s);
    const { resultado } = await sondarEndpoint(servico(), ep(`https://127.0.0.1:${porta}/ws/status.asmx`));
    assert.equal(resultado.diagnostico, "exige_certificado_cliente", resultado.detalhe);
    assert.equal(resultado.responde, true);
  });
});

describe("portais com cookie de sessão", () => {
  it("devolve o cookie recebido e sai do laço de redirecionamento", async () => {
    const servidor = http.createServer((req, res) => {
      if ((req.headers.cookie ?? "").includes("sessao=abc")) {
        res.writeHead(200, { "content-type": "text/xml" }).end(WSDL);
      } else {
        res.writeHead(302, { location: req.url ?? "/", "set-cookie": ["sessao=abc; path=/; HttpOnly"] }).end();
      }
    });
    const porta = await escutar(servidor);
    try {
      const url = `http://127.0.0.1:${porta}/portal/webServices.aspx`;
      const { resultado } = await sondarEndpoint(servico(), { ...ep(url), contrato: { tipo: "wsdl", url } });
      assert.equal(resultado.diagnostico, "contrato_obtido");
    } finally {
      servidor.close();
    }
  });

  it("guarda um resumo legível da página de erro 403", async () => {
    const servidor = http.createServer((_req, res) => {
      res.writeHead(403, { "content-type": "text/html" }).end("<html><style>b{}</style><h1>403 - Forbidden:</h1>\n<p>Access is denied.</p></html>");
    });
    const porta = await escutar(servidor);
    try {
      const { resultado } = await sondarEndpoint(servico(), ep(`http://127.0.0.1:${porta}/ws/a.asmx`));
      assert.equal(resultado.diagnostico, "acesso_negado");
      assert.equal(resultado.detalhe, "403 - Forbidden: Access is denied.");
    } finally {
      servidor.close();
    }
  });
});

describe("falhas transitórias", () => {
  it("repete quando o servidor derruba a conexão e aceita a resposta seguinte", async () => {
    let chamadas = 0;
    const servidor = http.createServer((req, res) => {
      chamadas++;
      if (chamadas === 1) req.socket.destroy();
      else res.writeHead(200, { "content-type": "text/xml" }).end(WSDL);
    });
    const porta = await escutar(servidor);
    try {
      const { resultado } = await sondarComRepeticao(servico(), ep(`http://127.0.0.1:${porta}/ws/a.asmx`), { esperaMs: 10 });
      assert.equal(resultado.diagnostico, "contrato_obtido");
      assert.equal(chamadas, 2);
    } finally {
      servidor.close();
    }
  });

  it("desiste depois do limite e não repete falha definitiva", async () => {
    let quedas = 0;
    const derruba = http.createServer((req) => {
      quedas++;
      req.socket.destroy();
    });
    let negadas = 0;
    const nega = http.createServer((_req, res) => {
      negadas++;
      res.writeHead(403).end();
    });
    const [p1, p2] = [await escutar(derruba), await escutar(nega)];
    try {
      const a = await sondarComRepeticao(servico(), ep(`http://127.0.0.1:${p1}/a.asmx`), { tentativas: 3, esperaMs: 5 });
      assert.equal(a.resultado.diagnostico, "conexao_reiniciada");
      assert.equal(quedas, 3);
      const b = await sondarComRepeticao(servico(), ep(`http://127.0.0.1:${p2}/a.asmx`), { tentativas: 3, esperaMs: 5 });
      assert.equal(b.resultado.diagnostico, "acesso_negado");
      assert.equal(negadas, 1);
    } finally {
      derruba.close();
      nega.close();
    }
  });
});
