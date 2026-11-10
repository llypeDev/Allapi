import { createHash } from "node:crypto";
import type { Endpoint, Servico } from "./catalogo.ts";
import { baixar, exigeCertificado, resolverDns } from "./rede.ts";
import type { InfoTls, OpcoesBaixar } from "./rede.ts";

export type Diagnostico =
  | "contrato_obtido"
  | "http_200_sem_contrato"
  | "exige_certificado_cliente"
  | "acesso_negado"
  | "nao_encontrado"
  | "erro_http"
  | "dns_falhou"
  | "timeout"
  | "conexao_recusada"
  | "conexao_reiniciada"
  | "erro_tls"
  | "erro_rede";

export interface ResultadoSonda {
  url: string;
  url_contrato: string | null;
  verificado_em: string;
  origem: string;
  /** Há um servidor vivo nesse host e porta (mesmo que recuse a requisição). */
  responde: boolean;
  diagnostico: Diagnostico;
  detalhe?: string;
  status_http?: number;
  enderecos?: string[];
  tls?: InfoTls;
  contrato?: { tipo: "wsdl" | "openapi"; sha256: string; bytes: number; operacoes: string[] };
}

/** URL de onde o contrato deve ser baixado, ou null se o serviço não tem contrato legível por máquina. */
export function urlContrato(servico: Servico, endpoint: Endpoint): string | null {
  if (endpoint.contrato?.tipo === "nenhum") return null;
  if (endpoint.contrato?.url) return endpoint.contrato.url;
  if (servico.protocolo === "soap") {
    return endpoint.url.includes("?") ? endpoint.url : `${endpoint.url}?wsdl`;
  }
  return null;
}

export function analisarWsdl(texto: string): { operacoes: string[] } | null {
  if (!/<(?:[\w-]+:)?definitions\b[^>]*schemas\.xmlsoap\.org\/wsdl\//i.test(texto)) return null;
  const operacoes = new Set<string>();
  for (const m of texto.matchAll(/<(?:[\w-]+:)?operation\b[^>]*\bname="([^"]+)"/gi)) {
    operacoes.add(m[1]!);
  }
  return { operacoes: [...operacoes].sort() };
}

export function analisarOpenApi(texto: string): { operacoes: string[] } | null {
  let doc: unknown;
  try {
    doc = JSON.parse(texto);
  } catch {
    return null;
  }
  if (typeof doc !== "object" || doc === null) return null;
  const d = doc as Record<string, unknown>;
  if (!("openapi" in d || "swagger" in d) || typeof d.paths !== "object" || d.paths === null) return null;
  return { operacoes: Object.keys(d.paths as object).sort() };
}

function classificarFalha(codigo: string): Diagnostico {
  if (exigeCertificado(codigo)) return "exige_certificado_cliente";
  if (codigo === "TIMEOUT" || codigo === "ETIMEDOUT") return "timeout";
  if (codigo === "ECONNREFUSED") return "conexao_recusada";
  if (codigo === "ECONNRESET" || codigo === "EPIPE") return "conexao_reiniciada";
  if (codigo === "ENOTFOUND" || codigo === "EAI_AGAIN") return "dns_falhou";
  if (codigo.startsWith("ERR_SSL") || codigo.startsWith("ERR_TLS") || codigo.includes("CERT")) return "erro_tls";
  return "erro_rede";
}

export interface OpcoesSonda extends OpcoesBaixar {
  origem?: string;
  agora?: () => Date;
}

/**
 * Sonda um endpoint sem credencial: resolve DNS, abre TLS e tenta baixar o contrato.
 * Devolve também o corpo do contrato, para o chamador decidir se grava em disco.
 */
export async function sondarEndpoint(
  servico: Servico,
  endpoint: Endpoint,
  opcoes: OpcoesSonda = {},
): Promise<{ resultado: ResultadoSonda; corpoContrato?: Buffer }> {
  const alvo = urlContrato(servico, endpoint);
  const base: ResultadoSonda = {
    url: endpoint.url,
    url_contrato: alvo,
    verificado_em: (opcoes.agora?.() ?? new Date()).toISOString(),
    origem: opcoes.origem ?? "local",
    responde: false,
    diagnostico: "erro_rede",
  };

  const host = new URL(endpoint.url).hostname;
  const dns = await resolverDns(host);
  if (!dns.ok) return { resultado: { ...base, diagnostico: "dns_falhou", detalhe: dns.erro } };
  base.enderecos = dns.enderecos;

  const r = await baixar(alvo ?? endpoint.url, opcoes);
  if (!r.ok) {
    return {
      resultado: {
        ...base,
        responde: r.falha.servidor_respondeu,
        diagnostico: classificarFalha(r.falha.codigo),
        detalhe: `${r.falha.codigo}: ${r.falha.mensagem}`,
      },
    };
  }

  const { status, corpo, tls } = r.resposta;
  const comum: ResultadoSonda = { ...base, responde: true, status_http: status, ...(tls ? { tls } : {}) };

  if (status === 401 || status === 403) return { resultado: { ...comum, diagnostico: "acesso_negado" } };
  if (status === 404 || status === 410) return { resultado: { ...comum, diagnostico: "nao_encontrado" } };
  if (status < 200 || status >= 300) return { resultado: { ...comum, diagnostico: "erro_http" } };

  if (alvo) {
    const texto = corpo.toString("utf8");
    const wsdl = analisarWsdl(texto);
    const achado = wsdl ? { tipo: "wsdl" as const, ...wsdl } : null;
    const openapi = achado ? null : analisarOpenApi(texto);
    const contrato = achado ?? (openapi ? { tipo: "openapi" as const, ...openapi } : null);
    if (contrato) {
      return {
        corpoContrato: corpo,
        resultado: {
          ...comum,
          diagnostico: "contrato_obtido",
          contrato: {
            tipo: contrato.tipo,
            sha256: createHash("sha256").update(corpo).digest("hex"),
            bytes: corpo.length,
            operacoes: contrato.operacoes,
          },
        },
      };
    }
  }
  return { resultado: { ...comum, diagnostico: "http_200_sem_contrato" } };
}

/** Executa tarefas com limite de simultaneidade, preservando a ordem dos resultados. */
export async function emParalelo<T, R>(itens: T[], limite: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const saida = new Array<R>(itens.length);
  let proximo = 0;
  const trabalhador = async () => {
    while (proximo < itens.length) {
      const i = proximo++;
      saida[i] = await fn(itens[i]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, trabalhador));
  return saida;
}
