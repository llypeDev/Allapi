import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { parse } from "yaml";

// ajv-formats é CommonJS: sob NodeNext o tipo do default vem como o módulo inteiro, não a função.
type Plugin = (ajv: Ajv2020) => unknown;
const addFormats: Plugin =
  (addFormatsModule as unknown as { default?: Plugin }).default ?? (addFormatsModule as unknown as Plugin);

export type Ambiente = "producao" | "homologacao";
export type Resolucao = "proprio" | "compartilhado" | "sem_api" | "nao_existe" | "pendente";

export interface Endpoint {
  ambiente: Ambiente;
  url: string;
  contrato?: { tipo: "wsdl" | "openapi" | "nenhum"; url?: string };
  contrato_restrito?: boolean;
}

export interface Servico {
  id: string;
  item: string;
  nome: string;
  descricao?: string;
  versao?: string;
  protocolo: "soap" | "rest" | "portal" | "arquivo";
  autenticacao: string;
  endpoints: Endpoint[];
  origem: { tipo: "oficial" | "secundaria" | "memoria"; registrado_em: string; referencias?: string[] };
  notas?: string;
}

export interface ItemChecklist {
  resolucao: Resolucao;
  compartilhado_com?: string[];
  evidencia?: { url: string; consultado_em: string; nota?: string };
  nota?: string;
}

export interface ArquivoCatalogo {
  escopo: "nacional" | "uf";
  id: string;
  nome: string;
  mantenedor?: string;
  uf?: string;
  status?: "em_andamento" | "fechado";
  atende?: {
    item: string;
    ufs: string[];
    papel?: string;
    confirmado?: boolean;
    evidencia?: { url: string; consultado_em: string; nota?: string };
    nota?: string;
  }[];
  checklist?: Record<string, ItemChecklist>;
  servicos: Servico[];
  notas?: string;
  /** Caminho relativo à raiz do repositório; preenchido na carga. */
  caminho: string;
}

export interface Taxonomia {
  categorias: { id: string; nome: string; itens: { id: string; nome: string }[] }[];
}

export interface Catalogo {
  taxonomia: Taxonomia;
  /** Todos os itens no formato categoria.item, na ordem da taxonomia. */
  itens: string[];
  nomesItens: Map<string, string>;
  arquivos: ArquivoCatalogo[];
  erros: string[];
}

function listarYaml(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => join(dir, f));
}

export function carregarTaxonomia(raiz: string): Taxonomia {
  return parse(readFileSync(join(raiz, "catalogo", "taxonomia.yaml"), "utf8")) as Taxonomia;
}

/**
 * Carrega e valida o catálogo inteiro. Não lança em erro de conteúdo:
 * devolve tudo em `erros`, para o chamador mostrar todos de uma vez.
 */
export function carregarCatalogo(raiz: string): Catalogo {
  const erros: string[] = [];
  const taxonomia = carregarTaxonomia(raiz);
  const itens: string[] = [];
  const nomesItens = new Map<string, string>();
  for (const c of taxonomia.categorias) {
    for (const i of c.itens) {
      const ref = `${c.id}.${i.id}`;
      if (nomesItens.has(ref)) erros.push(`taxonomia: item duplicado ${ref}`);
      itens.push(ref);
      nomesItens.set(ref, i.nome);
    }
  }

  const schema = JSON.parse(readFileSync(join(raiz, "schema", "catalogo.schema.json"), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const validar = ajv.compile(schema);

  const arquivos: ArquivoCatalogo[] = [];
  const caminhos = [
    ...listarYaml(join(raiz, "catalogo", "nacional")),
    ...listarYaml(join(raiz, "catalogo", "uf")),
  ];
  for (const caminhoAbs of caminhos) {
    const caminho = relative(raiz, caminhoAbs);
    let doc: unknown;
    try {
      doc = parse(readFileSync(caminhoAbs, "utf8"));
    } catch (e) {
      erros.push(`${caminho}: YAML inválido: ${(e as Error).message}`);
      continue;
    }
    if (!validar(doc)) {
      for (const err of validar.errors ?? []) {
        erros.push(`${caminho}: ${err.instancePath || "/"} ${err.message ?? "inválido"}`);
      }
      continue;
    }
    arquivos.push({ ...(doc as Omit<ArquivoCatalogo, "caminho">), caminho });
  }

  erros.push(...verificarSemantica(arquivos, itens));
  return { taxonomia, itens, nomesItens, arquivos, erros };
}

/** Regras que o JSON Schema não expressa: referências cruzadas e unicidade. */
export function verificarSemantica(arquivos: ArquivoCatalogo[], itens: string[]): string[] {
  const erros: string[] = [];
  const conjuntoItens = new Set(itens);
  const idsArquivos = new Map<string, string>();
  const idsServicos = new Map<string, string>();

  for (const a of arquivos) {
    const esperado = a.caminho.replace(/\\/g, "/").split("/").pop()!.replace(/\.yaml$/, "");
    if (a.id !== esperado) erros.push(`${a.caminho}: id "${a.id}" deve ser igual ao nome do arquivo ("${esperado}")`);
    if (a.escopo === "uf" && a.uf && a.id !== a.uf.toLowerCase()) {
      erros.push(`${a.caminho}: arquivo de UF deve ter id "${a.uf.toLowerCase()}"`);
    }
    const pasta = a.escopo === "uf" ? "catalogo/uf/" : "catalogo/nacional/";
    if (!a.caminho.replace(/\\/g, "/").startsWith(pasta)) {
      erros.push(`${a.caminho}: escopo ${a.escopo} deve ficar em ${pasta}`);
    }
    const anterior = idsArquivos.get(a.id);
    if (anterior) erros.push(`${a.caminho}: id de arquivo "${a.id}" já usado em ${anterior}`);
    idsArquivos.set(a.id, a.caminho);

    for (const s of a.servicos) {
      const onde = `${a.caminho}: serviço ${s.id}`;
      const dono = idsServicos.get(s.id);
      if (dono) erros.push(`${onde}: id já usado em ${dono}`);
      idsServicos.set(s.id, a.caminho);
      if (!s.id.startsWith(`${a.id}.`)) erros.push(`${onde}: id deve começar com "${a.id}."`);
      if (!conjuntoItens.has(s.item)) erros.push(`${onde}: item "${s.item}" não existe na taxonomia`);
      const vistos = new Set<string>();
      for (const e of s.endpoints) {
        if (vistos.has(e.ambiente)) erros.push(`${onde}: mais de um endpoint de ${e.ambiente}`);
        vistos.add(e.ambiente);
      }
    }

    if (a.escopo === "uf") {
      if (!a.uf) erros.push(`${a.caminho}: escopo uf exige o campo "uf"`);
      if (!a.checklist) erros.push(`${a.caminho}: escopo uf exige o campo "checklist"`);
      if (a.atende) erros.push(`${a.caminho}: "atende" só existe no escopo nacional`);
    } else {
      if (a.uf) erros.push(`${a.caminho}: "uf" só existe no escopo uf`);
      if (a.checklist) erros.push(`${a.caminho}: "checklist" só existe no escopo uf`);
    }

    for (const at of a.atende ?? []) {
      if (!conjuntoItens.has(at.item)) erros.push(`${a.caminho}: atende.item "${at.item}" não existe na taxonomia`);
      if (at.confirmado && !at.evidencia) erros.push(`${a.caminho}: atende ${at.item} está confirmado sem evidência`);
      if (at.confirmado && at.ufs.length === 0) erros.push(`${a.caminho}: atende ${at.item} está confirmado sem nenhuma UF`);
    }

    if (a.escopo === "uf") {
      const checklist = a.checklist ?? {};
      for (const item of itens) {
        if (!(item in checklist)) erros.push(`${a.caminho}: checklist sem o item "${item}"`);
      }
      for (const [item, r] of Object.entries(checklist)) {
        if (!conjuntoItens.has(item)) {
          erros.push(`${a.caminho}: checklist com item fora da taxonomia: "${item}"`);
          continue;
        }
        for (const ref of r.compartilhado_com ?? []) {
          const dep = arquivos.find((x) => x.escopo === "nacional" && x.id === ref);
          if (!dep) {
            erros.push(`${a.caminho}: ${item} compartilha com "${ref}", que não existe em catalogo/nacional`);
            continue;
          }
          // Se o ambiente declara quais UFs atende nesse item, o estado precisa estar na relação.
          const relacoes = (dep.atende ?? []).filter((at) => at.item === item && at.ufs.length > 0);
          if (relacoes.length > 0 && a.uf && !relacoes.some((at) => at.ufs.includes(a.uf!))) {
            erros.push(`${a.caminho}: ${item} compartilha com "${ref}", mas ${a.uf} não está na relação de UFs que "${ref}" atende`);
          }
        }
        const temServico = a.servicos.some((s) => s.item === item);
        if (r.resolucao === "proprio" && !temServico) {
          erros.push(`${a.caminho}: ${item} está como "proprio" mas não há serviço cadastrado`);
        }
        if ((r.resolucao === "nao_existe" || r.resolucao === "compartilhado") && temServico) {
          erros.push(`${a.caminho}: ${item} está como "${r.resolucao}" mas há serviço próprio cadastrado`);
        }
      }
    }
  }
  return erros;
}
