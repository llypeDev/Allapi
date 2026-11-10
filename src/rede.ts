import { constants as cryptoConstants } from "node:crypto";
import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import type { TLSSocket } from "node:tls";

export interface InfoTls {
  protocolo: string | null;
  /** A cadeia fecha numa AC do repositório público do Node? ICP-Brasil normalmente não fecha. */
  cadeia_publica: boolean;
  erro_cadeia?: string;
  sujeito?: string;
  emissor?: string;
  valido_ate?: string;
}

export interface Resposta {
  url_final: string;
  status: number;
  content_type: string | null;
  corpo: Buffer;
  tls?: InfoTls;
}

export interface Falha {
  codigo: string;
  mensagem: string;
  /** O servidor chegou a responder em nível de TLS (ex.: recusou por falta de certificado). */
  servidor_respondeu: boolean;
}

export type Resultado = { ok: true; resposta: Resposta } | { ok: false; falha: Falha };

export interface OpcoesBaixar {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirecionamentos?: number;
  /** Uso em teste: AC adicional para servidores locais. */
  ca?: string | Buffer;
}

const AGENTE = "Mozilla/5.0 (compatible; catalogo-servicos-fiscais/0.1)";

// Alertas TLS que o servidor manda quando exige certificado de cliente e não recebe um.
const ALERTAS_CERTIFICADO = [
  "CERTIFICATE_REQUIRED",
  "ALERT_HANDSHAKE_FAILURE",
  "ALERT_BAD_CERTIFICATE",
  "ALERT_CERTIFICATE_UNKNOWN",
  "ALERT_ACCESS_DENIED",
  "ALERT_UNKNOWN_CA",
];

export function exigeCertificado(codigo: string): boolean {
  return ALERTAS_CERTIFICADO.some((a) => codigo.includes(a));
}

export async function resolverDns(host: string): Promise<{ ok: boolean; enderecos: string[]; erro?: string }> {
  try {
    const r = await lookup(host, { all: true });
    return { ok: true, enderecos: r.map((x) => x.address) };
  } catch (e) {
    return { ok: false, enderecos: [], erro: (e as NodeJS.ErrnoException).code ?? (e as Error).message };
  }
}

function umaRequisicao(url: URL, opcoes: OpcoesBaixar): Promise<Resultado & { location?: string }> {
  const timeoutMs = opcoes.timeoutMs ?? 20_000;
  const maxBytes = opcoes.maxBytes ?? 5 * 1024 * 1024;
  return new Promise((resolve) => {
    let terminado = false;
    const fim = (r: Resultado & { location?: string }) => {
      if (terminado) return;
      terminado = true;
      resolve(r);
    };
    const comum = {
      method: "GET",
      agent: false as const,
      timeout: timeoutMs,
      headers: { "user-agent": AGENTE, accept: "*/*" },
    };
    const aoResponder = (res: http.IncomingMessage) => {
      let tls: InfoTls | undefined;
      if (url.protocol === "https:") {
        const s = res.socket as TLSSocket;
        const cert = s.getPeerCertificate();
        tls = {
          protocolo: s.getProtocol(),
          cadeia_publica: s.authorized,
          ...(s.authorized ? {} : { erro_cadeia: String(s.authorizationError ?? "") }),
          sujeito: textoCert(cert?.subject?.CN),
          emissor: textoCert(cert?.issuer?.CN ?? cert?.issuer?.O),
          valido_ate: cert?.valid_to ? new Date(cert.valid_to).toISOString() : undefined,
        };
      }
      const partes: Buffer[] = [];
      let total = 0;
      res.on("data", (b: Buffer) => {
        total += b.length;
        if (total <= maxBytes) partes.push(b);
        else res.destroy();
      });
      const entregar = () =>
        fim({
          ok: true,
          location: typeof res.headers.location === "string" ? res.headers.location : undefined,
          resposta: {
            url_final: url.toString(),
            status: res.statusCode ?? 0,
            content_type: res.headers["content-type"] ?? null,
            corpo: Buffer.concat(partes),
            tls,
          },
        });
      res.on("end", entregar);
      res.on("close", entregar);
      res.on("error", entregar);
    };

    const req =
      url.protocol === "https:"
        ? https.request(
            url,
            {
              ...comum,
              // Esta sonda só faz GET de contrato público e não envia nenhum dado. Os servidores
              // fiscais usam cadeias ICP-Brasil, ausentes do repositório público de ACs, e muitos
              // ainda dependem de renegociação legada. A validação da cadeia não é ignorada:
              // o resultado dela é registrado em `cadeia_publica` / `erro_cadeia`.
              rejectUnauthorized: false,
              secureOptions: cryptoConstants.SSL_OP_LEGACY_SERVER_CONNECT,
              ciphers: "DEFAULT@SECLEVEL=0",
              ...(opcoes.ca ? { ca: opcoes.ca } : {}),
            },
            aoResponder,
          )
        : http.request(url, comum, aoResponder);

    req.on("timeout", () => {
      req.destroy(Object.assign(new Error(`sem resposta em ${timeoutMs} ms`), { code: "TIMEOUT" }));
    });
    req.on("error", (e: NodeJS.ErrnoException) => {
      const codigo = e.code ?? "ERRO";
      fim({
        ok: false,
        falha: { codigo, mensagem: e.message, servidor_respondeu: exigeCertificado(codigo) },
      });
    });
    req.end();
  });
}

function textoCert(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v.join(", ") : v;
}

/** GET com redirecionamentos, sem lançar: toda falha vira um Resultado classificável. */
export async function baixar(urlTexto: string, opcoes: OpcoesBaixar = {}): Promise<Resultado> {
  const max = opcoes.maxRedirecionamentos ?? 5;
  let url: URL;
  try {
    url = new URL(urlTexto);
  } catch {
    return { ok: false, falha: { codigo: "URL_INVALIDA", mensagem: urlTexto, servidor_respondeu: false } };
  }
  for (let i = 0; i <= max; i++) {
    const r = await umaRequisicao(url, opcoes);
    if (!r.ok) return r;
    const { status } = r.resposta;
    if (status >= 300 && status < 400 && r.location) {
      url = new URL(r.location, url);
      continue;
    }
    return { ok: true, resposta: r.resposta };
  }
  return { ok: false, falha: { codigo: "REDIRECIONAMENTOS", mensagem: `mais de ${max} redirecionamentos`, servidor_respondeu: true } };
}
