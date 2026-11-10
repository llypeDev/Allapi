import type { ArquivoCatalogo, Catalogo, Endpoint, Servico } from "./catalogo.ts";
import { normalizarUrl } from "./coleta.ts";
import { chaveSonda } from "./estado.ts";
import type { Estado } from "./estado.ts";
import { urlContrato } from "./sonda.ts";
import type { ResultadoSonda } from "./sonda.ts";

export type SituacaoContrato = "obtido" | "restrito" | "nao_se_aplica" | "ausente" | "nao_sondado";

export interface Verificacao {
  arquivo: string;
  servico: Servico;
  endpoint: Endpoint;
  /** coletada: a URL aparece numa fonte oficial coletada. declarada: registro manual com referência oficial. */
  oficial: "coletada" | "declarada" | "nao";
  fontes: string[];
  responde: boolean | null;
  contrato: SituacaoContrato;
  sonda?: ResultadoSonda;
  aprovado: boolean;
  pendencias: string[];
}

export interface ResultadoGate {
  arquivo: ArquivoCatalogo;
  aprovado: boolean;
  pendencias: string[];
  verificacoes: Verificacao[];
  lacunas: string[];
}

export interface Analise {
  gates: ResultadoGate[];
  /** URLs publicadas em fonte oficial que não estão em nenhum arquivo do catálogo. */
  lacunas: { url: string; fontes: string[] }[];
}

const RECUSA_POR_CREDENCIAL = new Set(["exige_certificado_cliente", "acesso_negado"]);

function indiceOficial(estado: Estado): Map<string, string[]> {
  const indice = new Map<string, string[]>();
  for (const [id, f] of Object.entries(estado.fontes)) {
    for (const url of f.urls_servico) {
      const lista = indice.get(url) ?? [];
      lista.push(id);
      indice.set(url, lista);
    }
  }
  return indice;
}

function verificar(arquivo: ArquivoCatalogo, servico: Servico, endpoint: Endpoint, estado: Estado, oficial: Map<string, string[]>): Verificacao {
  const pendencias: string[] = [];
  const fontes = oficial.get(normalizarUrl(endpoint.url) ?? "") ?? [];
  const declarada = servico.origem.tipo === "oficial" && (servico.origem.referencias?.length ?? 0) > 0;
  const situacaoOficial = fontes.length > 0 ? "coletada" : declarada ? "declarada" : "nao";
  if (situacaoOficial === "nao") pendencias.push("URL não confirmada em fonte oficial");

  const sonda = estado.sondas[chaveSonda(servico.id, endpoint.ambiente)];
  // Uma sonda feita para outra URL (endpoint alterado depois) não vale como verificação.
  const sondaValida = sonda && sonda.url === endpoint.url ? sonda : undefined;
  const responde = sondaValida ? sondaValida.responde : null;
  if (responde === null) pendencias.push("ainda não sondado");
  else if (!responde) pendencias.push(`servidor não respondeu (${sondaValida!.diagnostico})`);

  let contrato: SituacaoContrato;
  if (!sondaValida) contrato = "nao_sondado";
  else if (sondaValida.contrato) contrato = "obtido";
  else if (urlContrato(servico, endpoint) === null) contrato = "nao_se_aplica";
  else if (endpoint.contrato_restrito && RECUSA_POR_CREDENCIAL.has(sondaValida.diagnostico)) contrato = "restrito";
  else contrato = "ausente";
  if (contrato === "ausente") {
    const dica = RECUSA_POR_CREDENCIAL.has(sondaValida!.diagnostico)
      ? "; se a recusa for por falta de certificado, marcar contrato_restrito"
      : "";
    pendencias.push(`contrato não obtido (${sondaValida!.diagnostico})${dica}`);
  }
  if (contrato === "nao_se_aplica" && sondaValida && sondaValida.diagnostico !== "http_200_sem_contrato" && sondaValida.responde) {
    pendencias.push(`página não abriu normalmente (${sondaValida.diagnostico})`);
  }

  return {
    arquivo: arquivo.id,
    servico,
    endpoint,
    oficial: situacaoOficial,
    fontes,
    responde,
    contrato,
    sonda: sondaValida,
    aprovado: pendencias.length === 0,
    pendencias,
  };
}

export function analisar(catalogo: Catalogo, estado: Estado): Analise {
  const oficial = indiceOficial(estado);
  const noCatalogo = new Set<string>();
  const hostsPorArquivo = new Map<string, Set<string>>();
  for (const a of catalogo.arquivos) {
    const hosts = new Set<string>();
    for (const s of a.servicos) {
      for (const e of s.endpoints) {
        const n = normalizarUrl(e.url);
        if (n) noCatalogo.add(n);
        hosts.add(new URL(e.url).host.toLowerCase());
      }
    }
    hostsPorArquivo.set(a.id, hosts);
  }

  const lacunas = [...oficial.entries()]
    .filter(([url]) => !noCatalogo.has(url))
    .map(([url, fontes]) => ({ url, fontes }))
    .sort((a, b) => a.url.localeCompare(b.url));

  const porId = new Map(catalogo.arquivos.map((a) => [a.id, a]));
  const gates = new Map<string, ResultadoGate>();

  // Nacionais primeiro: o gate de um estado depende do gate dos ambientes que ele compartilha.
  const ordem = [...catalogo.arquivos].sort((a, b) => (a.escopo === b.escopo ? 0 : a.escopo === "nacional" ? -1 : 1));
  for (const a of ordem) {
    const pendencias: string[] = [];
    const verificacoes = a.servicos.flatMap((s) => s.endpoints.map((e) => verificar(a, s, e, estado, oficial)));
    for (const v of verificacoes) {
      for (const p of v.pendencias) pendencias.push(`${v.servico.id} (${v.endpoint.ambiente}): ${p}`);
    }

    const hosts = hostsPorArquivo.get(a.id)!;
    const lacunasDoArquivo = lacunas.filter((l) => hosts.has(new URL(l.url).host)).map((l) => l.url);
    for (const url of lacunasDoArquivo) pendencias.push(`fonte oficial lista ${url}, que não está no catálogo`);

    if (a.escopo === "nacional") {
      if (a.servicos.length === 0) pendencias.push("nenhum serviço cadastrado");
      for (const at of a.atende ?? []) {
        if (!at.confirmado) pendencias.push(`relação de UFs atendidas em ${at.item} não confirmada em fonte oficial`);
      }
    } else {
      for (const item of catalogo.itens) {
        const r = a.checklist?.[item];
        if (!r || r.resolucao === "pendente") {
          pendencias.push(`checklist: ${item} pendente`);
          continue;
        }
        for (const ref of r.compartilhado_com ?? []) {
          const dep = porId.get(ref);
          const gateDep = gates.get(ref);
          if (!dep || !gateDep) {
            pendencias.push(`checklist: ${item} depende de "${ref}", que não existe`);
            continue;
          }
          // A dependência é por item: o estado não espera o ambiente inteiro, só os serviços que usa.
          const doItem = gateDep.verificacoes.filter((v) => v.servico.item === item);
          if (doItem.length === 0) {
            pendencias.push(`checklist: ${item} depende de "${ref}", que não tem serviço cadastrado para esse item`);
          } else if (doItem.some((v) => !v.aprovado)) {
            pendencias.push(`checklist: ${item} depende de "${ref}", cujos serviços desse item ainda têm pendência`);
          }
          const naRelacao = (dep.atende ?? []).some((at) => at.item === item && at.confirmado && at.ufs.includes(a.uf ?? ""));
          if (!naRelacao && !r.evidencia) {
            pendencias.push(`checklist: ${item} declara uso de "${ref}" sem evidência (a relação oficial de UFs de "${ref}" não confirma ${a.uf})`);
          }
        }
      }
    }
    gates.set(a.id, { arquivo: a, aprovado: pendencias.length === 0, pendencias, verificacoes, lacunas: lacunasDoArquivo });
  }

  return { gates: catalogo.arquivos.map((a) => gates.get(a.id)!), lacunas };
}

const marca = (v: boolean | null) => (v === null ? "—" : v ? "sim" : "não");

const TEXTO_CONTRATO: Record<SituacaoContrato, string> = {
  obtido: "obtido",
  restrito: "restrito (exige certificado)",
  nao_se_aplica: "não se aplica",
  ausente: "não obtido",
  nao_sondado: "—",
};

function dataMaisRecente(datas: (string | undefined)[]): string {
  const validas = datas.filter((d): d is string => !!d).sort();
  return validas.at(-1)?.slice(0, 10) ?? "nunca";
}

export function gerarMarkdown(catalogo: Catalogo, estado: Estado, analise: Analise): string {
  const l: string[] = [];
  const todas = analise.gates.flatMap((g) => g.verificacoes);
  const conta = (f: (v: Verificacao) => boolean) => todas.filter(f).length;

  l.push("# Cobertura do catálogo", "");
  l.push("Gerado por `npm run relatorio` a partir de `catalogo/` e `estado/`. Não editar à mão.", "");
  l.push(`- Última coleta de fontes oficiais: ${dataMaisRecente(Object.values(estado.fontes).map((f) => f.coletado_em))}`);
  l.push(`- Última sonda: ${dataMaisRecente(Object.values(estado.sondas).map((s) => s.verificado_em))}`);
  l.push(`- Endpoints no catálogo: ${todas.length}`);
  l.push(`- Confirmados em fonte oficial: ${conta((v) => v.oficial !== "nao")}`);
  l.push(`- Servidor respondeu: ${conta((v) => v.responde === true)}`);
  l.push(`- Contrato obtido: ${conta((v) => v.contrato === "obtido")}`);
  l.push(`- Aprovados em tudo: ${conta((v) => v.aprovado)}`);
  l.push(`- URLs oficiais fora do catálogo: ${analise.lacunas.length}`, "");

  l.push("## Arquivos", "");
  l.push("| Arquivo | Escopo | Status | Endpoints | Aprovados | Pendências | Gate |");
  l.push("|---|---|---|---:|---:|---:|---|");
  for (const g of analise.gates) {
    const a = g.arquivo;
    l.push(
      `| ${a.id} | ${a.escopo} | ${a.status ?? "em_andamento"} | ${g.verificacoes.length} | ${g.verificacoes.filter((v) => v.aprovado).length} | ${g.pendencias.length} | ${g.aprovado ? "passa" : "não passa"} |`,
    );
  }
  l.push("");

  const ufs = analise.gates.filter((g) => g.arquivo.escopo === "uf");
  if (ufs.length > 0) {
    l.push("## Checklist por estado", "");
    l.push(`| Item | ${ufs.map((g) => g.arquivo.uf).join(" | ")} |`);
    l.push(`|---|${ufs.map(() => "---").join("|")}|`);
    for (const item of catalogo.itens) {
      l.push(`| ${catalogo.nomesItens.get(item)} | ${ufs.map((g) => g.arquivo.checklist?.[item]?.resolucao ?? "pendente").join(" | ")} |`);
    }
    l.push("");
  }

  l.push("## Fontes oficiais", "");
  l.push("| Fonte | Situação | URLs encontradas | Coletado em |");
  l.push("|---|---|---:|---|");
  for (const [id, f] of Object.entries(estado.fontes).sort(([a], [b]) => a.localeCompare(b))) {
    const situacao = f.falha_recente ? `falhou na última coleta (${f.falha_recente.erro})` : f.ok ? "ok" : `falhou (${f.erro ?? "?"})`;
    l.push(`| ${id} | ${situacao} | ${f.urls_servico.length} | ${f.coletado_em.slice(0, 10)} |`);
  }
  if (Object.keys(estado.fontes).length === 0) l.push("| (nenhuma coleta feita ainda) | | | |");
  l.push("");

  for (const g of analise.gates) {
    l.push(`## ${g.arquivo.nome} (\`${g.arquivo.id}\`)`, "");
    if (g.verificacoes.length > 0) {
      l.push("| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |");
      l.push("|---|---|---|---|---|---|");
      for (const v of g.verificacoes) {
        const oficial = v.oficial === "nao" ? "não" : `${v.oficial}${v.fontes.length ? ` (${v.fontes.join(", ")})` : ""}`;
        l.push(
          `| \`${v.servico.id}\` | ${v.endpoint.ambiente} | ${oficial} | ${marca(v.responde)} | ${TEXTO_CONTRATO[v.contrato]} | ${v.sonda?.diagnostico ?? "—"} |`,
        );
      }
      l.push("");
    }
    const outras = g.pendencias.filter((p) => !/^\S+ \((producao|homologacao)\): /.test(p));
    if (outras.length > 0) {
      l.push("Pendências do arquivo:", "");
      for (const p of outras) l.push(`- ${p}`);
      l.push("");
    }
  }

  l.push("## URLs oficiais fora do catálogo", "");
  if (analise.lacunas.length === 0) {
    l.push("Nenhuma.", "");
  } else {
    l.push("Publicadas em fonte oficial coletada e ainda sem registro. Cada uma precisa virar serviço no catálogo ou ser descartada com justificativa.", "");
    l.push("| URL | Fonte |", "|---|---|");
    for (const x of analise.lacunas) l.push(`| ${x.url} | ${x.fontes.join(", ")} |`);
    l.push("");
  }
  return l.join("\n");
}
