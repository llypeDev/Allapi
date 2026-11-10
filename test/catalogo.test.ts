import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { carregarCatalogo, verificarSemantica } from "../src/catalogo.ts";
import type { ArquivoCatalogo, Servico } from "../src/catalogo.ts";
import { carregarDescartes, carregarFontes, extrairUrlsServico, normalizarUrl } from "../src/coleta.ts";
import { carregarEstado } from "../src/estado.ts";
import type { Estado } from "../src/estado.ts";
import { analisar, gerarMarkdown } from "../src/relatorio.ts";
import type { ResultadoSonda } from "../src/sonda.ts";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ITENS = ["documentos_fiscais.nfe", "cadastro.sintegra"];

function servico(id: string, url: string, extra: Partial<Servico> = {}): Servico {
  return {
    id,
    item: "documentos_fiscais.nfe",
    nome: id,
    protocolo: "soap",
    autenticacao: "certificado_icp",
    endpoints: [{ ambiente: "producao", url }],
    origem: { tipo: "memoria", registrado_em: "2026-01-01" },
    ...extra,
  };
}

function nacional(id: string, servicos: Servico[], extra: Partial<ArquivoCatalogo> = {}): ArquivoCatalogo {
  return { escopo: "nacional", id, nome: id, servicos, caminho: `catalogo/nacional/${id}.yaml`, ...extra };
}

function estadoUf(extra: Partial<ArquivoCatalogo> = {}): ArquivoCatalogo {
  return {
    escopo: "uf",
    id: "sp",
    uf: "SP",
    nome: "São Paulo",
    servicos: [],
    caminho: "catalogo/uf/sp.yaml",
    checklist: {
      "documentos_fiscais.nfe": { resolucao: "compartilhado", compartilhado_com: ["svrs"] },
      "cadastro.sintegra": { resolucao: "sem_api", evidencia: { url: "https://exemplo.gov.br/sintegra", consultado_em: "2026-01-01" } },
    },
    ...extra,
  };
}

function sonda(url: string, extra: Partial<ResultadoSonda> = {}): ResultadoSonda {
  return {
    url,
    url_contrato: `${url}?wsdl`,
    verificado_em: "2026-01-02T00:00:00.000Z",
    origem: "teste",
    responde: true,
    diagnostico: "contrato_obtido",
    contrato: { tipo: "wsdl", sha256: "a".repeat(64), bytes: 10, operacoes: ["op"] },
    ...extra,
  };
}

function montar(arquivos: ArquivoCatalogo[]) {
  return { taxonomia: { categorias: [] }, itens: ITENS, nomesItens: new Map(ITENS.map((i) => [i, i])), arquivos, erros: [] };
}

const URL_A = "https://nfe.exemplo.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx";
const fonteCom = (...urls: string[]): Estado["fontes"] => ({
  portal: { url: "https://portal.exemplo.gov.br", coletado_em: "2026-01-02T00:00:00.000Z", ok: true, urls_servico: urls.map((u) => normalizarUrl(u)!) },
});

describe("catálogo do repositório", () => {
  it("carrega sem erros de schema nem de referência", () => {
    const c = carregarCatalogo(RAIZ);
    assert.deepEqual(c.erros, []);
    assert.ok(c.arquivos.length > 0);
  });

  it("não deixa nenhum arquivo marcado como fechado sem passar no gate", () => {
    const c = carregarCatalogo(RAIZ);
    for (const g of analisar(c, carregarEstado(RAIZ)).gates) {
      if (g.arquivo.status === "fechado") assert.deepEqual(g.pendencias, [], g.arquivo.id);
    }
  });
});

describe("regras semânticas", () => {
  it("aceita um conjunto coerente", () => {
    assert.deepEqual(verificarSemantica([nacional("svrs", [servico("svrs.nfe.aut", URL_A)]), estadoUf()], ITENS), []);
  });

  it("rejeita id de serviço repetido, fora do prefixo ou com item inexistente", () => {
    const erros = verificarSemantica(
      [
        nacional("svrs", [servico("svrs.nfe.aut", URL_A), servico("svrs.nfe.aut", URL_A)]),
        nacional("an", [servico("outro.nfe.x", URL_A), servico("an.nfe.y", URL_A, { item: "nao.existe" })]),
      ],
      ITENS,
    );
    assert.ok(erros.some((e) => e.includes("id já usado")));
    assert.ok(erros.some((e) => e.includes('deve começar com "an."')));
    assert.ok(erros.some((e) => e.includes('"nao.existe" não existe na taxonomia')));
  });

  it("exige que o checklist do estado cubra toda a taxonomia", () => {
    const uf = estadoUf({ checklist: { "documentos_fiscais.nfe": { resolucao: "pendente" } } });
    const erros = verificarSemantica([uf], ITENS);
    assert.ok(erros.some((e) => e.includes('checklist sem o item "cadastro.sintegra"')));
  });

  it("rejeita compartilhamento com ambiente que não existe e 'proprio' sem serviço", () => {
    const uf = estadoUf({
      checklist: {
        "documentos_fiscais.nfe": { resolucao: "compartilhado", compartilhado_com: ["fantasma"] },
        "cadastro.sintegra": { resolucao: "proprio" },
      },
    });
    const erros = verificarSemantica([uf], ITENS);
    assert.ok(erros.some((e) => e.includes('"fantasma"')));
    assert.ok(erros.some((e) => e.includes('"proprio" mas não há serviço')));
  });

  it("rejeita estado que compartilha um ambiente que não o atende", () => {
    const ev = { url: "https://portal.exemplo.gov.br", consultado_em: "2026-01-01" };
    const svrs = nacional("svrs", [servico("svrs.nfe.aut", URL_A)], { atende: [{ item: ITENS[0]!, ufs: ["RJ"], confirmado: true, evidencia: ev }] });
    assert.ok(verificarSemantica([svrs, estadoUf()], ITENS).some((e) => e.includes("SP não está na relação")));
    const comSp = nacional("svrs", [servico("svrs.nfe.aut", URL_A)], { atende: [{ item: ITENS[0]!, ufs: ["RJ", "SP"], confirmado: true, evidencia: ev }] });
    assert.deepEqual(verificarSemantica([comSp, estadoUf()], ITENS), []);
  });

  it("não aceita relação de UFs confirmada sem evidência", () => {
    const svrs = nacional("svrs", [servico("svrs.nfe.aut", URL_A)], { atende: [{ item: ITENS[0]!, ufs: ["RJ"], confirmado: true }] });
    assert.ok(verificarSemantica([svrs], ITENS).some((e) => e.includes("confirmado sem evidência")));
  });

  it("rejeita arquivo de UF com id diferente da sigla", () => {
    const erros = verificarSemantica([estadoUf({ id: "saopaulo", caminho: "catalogo/uf/saopaulo.yaml" })], ITENS);
    assert.ok(erros.some((e) => e.includes('deve ter id "sp"')));
  });
});

describe("coleta de fontes oficiais", () => {
  it("carrega as fontes e os descartes do repositório, todos com motivo", () => {
    assert.ok(carregarFontes(RAIZ).length > 0);
    for (const d of carregarDescartes(RAIZ)) {
      assert.ok(d.motivo.length > 10, d.contem);
      assert.equal(d.contem, d.contem.toLowerCase());
    }
  });

  it("normaliza URLs para comparação", () => {
    assert.equal(normalizarUrl("HTTPS://NFe.SVRS.rs.gov.br:443/ws/NfeAutorizacao/NFeAutorizacao4.asmx?WSDL"), "https://nfe.svrs.rs.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx");
    assert.equal(normalizarUrl("https://h/services/Gnre/"), "https://h/services/gnre");
    assert.equal(normalizarUrl("mailto:a@b"), null);
    assert.equal(normalizarUrl("não é url"), null);
  });

  it("extrai endpoints e descarta páginas, arquivos e espaços de nome", () => {
    const html = `
      <td>NfeAutorizacao</td><td>4.00</td><td>https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl</td>
      <td><a href="https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx">x</a>.</td>
      <span>https://www.gnre.pe.gov.br/gnreWS/services/GnreConfigUF?a=1&amp;b=2</span>
      <link href="https://portal.gov.br/estilo.css"><a href="https://portal.gov.br/portal/principal.aspx">início</a>
      <a href="https://portal.gov.br/">raiz</a> xmlns="http://www.portalfiscal.inf.br/nfe" xmlns:s="http://www.w3.org/2003/05/soap-envelope"
      <td>https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx</td>`;
    assert.deepEqual(extrairUrlsServico(html), [
      "https://nfe.sefa.pr.gov.br/nfe/nfeautorizacao4",
      "https://nfe.svrs.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx",
      "https://www.gnre.pe.gov.br/gnrews/services/gnreconfiguf",
    ]);
  });
});

describe("gate", () => {
  const chave = "svrs.nfe.aut@producao";

  it("passa quando a URL é oficial, o servidor responde e o contrato foi obtido", () => {
    const a = nacional("svrs", [servico("svrs.nfe.aut", URL_A)], {
      atende: [{ item: ITENS[0]!, ufs: ["RJ"], confirmado: true, evidencia: { url: "https://portal.exemplo.gov.br", consultado_em: "2026-01-01" } }],
    });
    const g = analisar(montar([a]), { fontes: fonteCom(URL_A), sondas: { [chave]: sonda(URL_A) } }).gates[0]!;
    assert.deepEqual(g.pendencias, []);
    assert.equal(g.aprovado, true);
    assert.equal(g.verificacoes[0]!.oficial, "coletada");
  });

  it("não passa com URL só de memória, mesmo respondendo", () => {
    const a = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const g = analisar(montar([a]), { fontes: {}, sondas: { [chave]: sonda(URL_A) } }).gates[0]!;
    assert.equal(g.aprovado, false);
    assert.ok(g.pendencias.some((p) => p.includes("não confirmada em fonte oficial")));
  });

  it("ignora sonda feita para uma URL que já foi trocada no catálogo", () => {
    const a = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const g = analisar(montar([a]), { fontes: fonteCom(URL_A), sondas: { [chave]: sonda("https://antigo.gov.br/x.asmx") } }).gates[0]!;
    assert.ok(g.pendencias.some((p) => p.includes("ainda não sondado")));
  });

  it("só aceita contrato restrito quando declarado e o servidor recusou por credencial", () => {
    const recusada = sonda(URL_A, { diagnostico: "exige_certificado_cliente", contrato: undefined });
    const semMarca = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const g1 = analisar(montar([semMarca]), { fontes: fonteCom(URL_A), sondas: { [chave]: recusada } }).gates[0]!;
    assert.equal(g1.aprovado, false);
    assert.ok(g1.pendencias.some((p) => p.includes("marcar contrato_restrito")));

    const comMarca = nacional("svrs", [servico("svrs.nfe.aut", URL_A, { endpoints: [{ ambiente: "producao", url: URL_A, contrato_restrito: true }] })]);
    const g2 = analisar(montar([comMarca]), { fontes: fonteCom(URL_A), sondas: { [chave]: recusada } }).gates[0]!;
    assert.equal(g2.aprovado, true);
    assert.equal(g2.verificacoes[0]!.contrato, "restrito");

    const fora = sonda(URL_A, { responde: false, diagnostico: "timeout", contrato: undefined });
    const g3 = analisar(montar([comMarca]), { fontes: fonteCom(URL_A), sondas: { [chave]: fora } }).gates[0]!;
    assert.equal(g3.aprovado, false);
  });

  it("acusa URL oficial do mesmo host que não está no catálogo", () => {
    const outra = "https://nfe.exemplo.gov.br/ws/NfeConsulta/NfeConsulta4.asmx";
    const a = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const analise = analisar(montar([a]), { fontes: fonteCom(URL_A, outra), sondas: { [chave]: sonda(URL_A) } });
    assert.deepEqual(analise.lacunas.map((l) => l.url), [normalizarUrl(outra)]);
    assert.equal(analise.gates[0]!.aprovado, false);
  });

  it("não fecha estado com item pendente, dependência com pendência ou uso sem evidência", () => {
    const ev = { url: "https://portal.exemplo.gov.br", consultado_em: "2026-01-01" };
    const svrs = nacional("svrs", [servico("svrs.nfe.aut", URL_A)], { atende: [{ item: ITENS[0]!, ufs: ["SP"], confirmado: true, evidencia: ev }] });
    const ok = { fontes: fonteCom(URL_A), sondas: { [chave]: sonda(URL_A) } };

    const dependente = analisar(montar([svrs, estadoUf()]), { fontes: {}, sondas: {} }).gates[1]!;
    assert.ok(dependente.pendencias.some((p) => p.includes('depende de "svrs", cujos serviços desse item ainda têm pendência')));

    const fechavel = analisar(montar([svrs, estadoUf()]), ok).gates[1]!;
    assert.deepEqual(fechavel.pendencias, []);

    // O ambiente não confirma a UF: o estado precisa trazer a própria evidência.
    const semRelacao = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const semEvidencia = analisar(montar([semRelacao, estadoUf()]), ok).gates[1]!;
    assert.ok(semEvidencia.pendencias.some((p) => p.includes("sem evidência")));
    const comEvidencia = estadoUf({
      checklist: { ...estadoUf().checklist!, "documentos_fiscais.nfe": { resolucao: "compartilhado", compartilhado_com: ["svrs"], evidencia: ev } },
    });
    assert.deepEqual(analisar(montar([semRelacao, comEvidencia]), ok).gates[1]!.pendencias, []);

    // Pendência em outro item do ambiente não trava o estado.
    const outroItem = nacional("svrs", [servico("svrs.nfe.aut", URL_A), servico("svrs.sintegra.x", "https://x.exemplo.gov.br/a.asmx", { item: "cadastro.sintegra" })], svrs);
    assert.deepEqual(analisar(montar([{ ...outroItem, id: "svrs", caminho: svrs.caminho }, estadoUf()]), ok).gates[1]!.pendencias, []);

    const pendente = estadoUf({ checklist: { ...estadoUf().checklist!, "cadastro.sintegra": { resolucao: "pendente" } } });
    const g = analisar(montar([svrs, pendente]), ok).gates[1]!;
    assert.deepEqual(g.pendencias, ["checklist: cadastro.sintegra pendente"]);
  });

  it("gera o relatório com as contagens corretas", () => {
    const a = nacional("svrs", [servico("svrs.nfe.aut", URL_A)]);
    const c = montar([a, estadoUf()]);
    const estado = { fontes: fonteCom(URL_A), sondas: { [chave]: sonda(URL_A) } };
    const md = gerarMarkdown(c, estado, analisar(c, estado));
    assert.match(md, /Endpoints no catálogo: 1/);
    assert.match(md, /Aprovados em tudo: 1/);
    assert.match(md, /\| svrs \| nacional \| em_andamento \| 1 \| 1 \| 0 \| passa \|/);
    assert.match(md, /## Checklist por estado/);
  });
});
