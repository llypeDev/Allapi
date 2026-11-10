import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { baixar } from "./rede.ts";
import type { OpcoesBaixar } from "./rede.ts";

export interface Fonte {
  id: string;
  orgao: string;
  descricao: string;
  url: string;
}

export interface EstadoFonte {
  url: string;
  coletado_em: string;
  ok: boolean;
  status_http?: number;
  erro?: string;
  bytes?: number;
  /** URLs candidatas a serviço encontradas na página, normalizadas. */
  urls_servico: string[];
  /** Preenchido quando a última coleta falhou e os dados acima são de uma coleta anterior. */
  falha_recente?: { em: string; erro: string };
  /** Hash do conjunto de URLs: muda só quando a relação oficial muda de fato. */
  urls_sha256?: string;
}

export function carregarFontes(raiz: string): Fonte[] {
  const doc = parse(readFileSync(join(raiz, "fontes", "fontes.yaml"), "utf8")) as { fontes: Fonte[] };
  const ids = new Set<string>();
  for (const f of doc.fontes) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.id)) throw new Error(`fontes.yaml: id inválido "${f.id}"`);
    if (ids.has(f.id)) throw new Error(`fontes.yaml: id duplicado "${f.id}"`);
    ids.add(f.id);
    new URL(f.url);
  }
  return doc.fontes;
}

/**
 * Forma canônica usada para comparar a URL do catálogo com a que a fonte oficial publica:
 * sem distinção de maiúsculas, sem query (?wsdl), sem barra final e sem porta padrão.
 */
export function normalizarUrl(texto: string): string | null {
  let u: URL;
  try {
    u = new URL(texto.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const caminho = u.pathname.replace(/\/+$/, "");
  return `${u.protocol}//${u.host}${caminho}`.toLowerCase();
}

const ENTIDADES: Record<string, string> = { "&amp;": "&", "&#38;": "&", "&#x26;": "&", "&#47;": "/", "&#x2f;": "/", "&#58;": ":", "&#x3a;": ":" };

function decodificarEntidades(html: string): string {
  return html.replace(/&amp;|&#38;|&#x26;|&#47;|&#x2f;|&#58;|&#x3a;/gi, (m) => ENTIDADES[m.toLowerCase()] ?? m);
}

const NAO_E_SERVICO = /\.(css|js|png|jpe?g|gif|svg|ico|pdf|zip|docx?|xlsx?|woff2?|ttf|html?|aspx|jsp|php)$/i;
const ESPACOS_DE_NOME = /(^|\.)(w3\.org|xmlsoap\.org|portalfiscal\.inf\.br|schemas\.microsoft\.com)$/i;

/**
 * Extrai de um HTML as URLs que podem ser endpoints de serviço, já normalizadas e sem repetição.
 * Não exige um formato de caminho (cada SEFAZ usa o seu): descarta só o que claramente não é
 * serviço — arquivos estáticos, páginas, espaços de nome XML e raízes de site.
 */
export function extrairUrlsServico(html: string): string[] {
  const texto = decodificarEntidades(html);
  const achadas = new Set<string>();
  for (const m of texto.matchAll(/https?:\/\/[^\s"'<>()\[\]{}\\]+/gi)) {
    const bruta = m[0].replace(/[.,;:]+$/, "");
    const n = normalizarUrl(bruta);
    if (!n) continue;
    const u = new URL(n);
    if (ESPACOS_DE_NOME.test(u.hostname)) continue;
    if (u.pathname === "" || u.pathname === "/") continue;
    if (NAO_E_SERVICO.test(u.pathname)) continue;
    achadas.add(n);
  }
  return [...achadas].sort();
}

export async function coletarFonte(
  fonte: Fonte,
  opcoes: OpcoesBaixar & { agora?: () => Date } = {},
): Promise<{ estado: EstadoFonte; corpo?: Buffer }> {
  const coletado_em = (opcoes.agora?.() ?? new Date()).toISOString();
  const r = await baixar(fonte.url, { timeoutMs: 30_000, ...opcoes });
  if (!r.ok) {
    return { estado: { url: fonte.url, coletado_em, ok: false, erro: `${r.falha.codigo}: ${r.falha.mensagem}`, urls_servico: [] } };
  }
  const { status, corpo } = r.resposta;
  if (status < 200 || status >= 300) {
    return { estado: { url: fonte.url, coletado_em, ok: false, status_http: status, erro: `HTTP ${status}`, urls_servico: [] } };
  }
  // latin1 preserva todos os bytes: as URLs são ASCII, então a codificação da página não importa aqui.
  const urls = extrairUrlsServico(corpo.toString("latin1"));
  return {
    corpo,
    estado: {
      url: fonte.url,
      coletado_em,
      ok: true,
      status_http: status,
      bytes: corpo.length,
      urls_servico: urls,
      urls_sha256: createHash("sha256").update(urls.join("\n")).digest("hex"),
    },
  };
}
