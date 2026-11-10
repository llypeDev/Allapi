import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { EstadoFonte } from "./coleta.ts";
import type { ResultadoSonda } from "./sonda.ts";

/** Estado gerado por máquina. Nunca editar à mão: o catálogo curado fica em catalogo/. */
export interface Estado {
  /** Chave: id da fonte em fontes/fontes.yaml */
  fontes: Record<string, EstadoFonte>;
  /** Chave: <id do serviço>@<ambiente> */
  sondas: Record<string, ResultadoSonda>;
}

function ler<T>(caminho: string, padrao: T): T {
  if (!existsSync(caminho)) return padrao;
  return JSON.parse(readFileSync(caminho, "utf8")) as T;
}

export function gravar(caminho: string, conteudo: string | Buffer): void {
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, conteudo);
}

function ordenado<T>(o: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
}

export function carregarEstado(raiz: string): Estado {
  return {
    fontes: ler(join(raiz, "estado", "fontes.json"), {}),
    sondas: ler(join(raiz, "estado", "sondas.json"), {}),
  };
}

export function gravarFontes(raiz: string, fontes: Estado["fontes"]): void {
  gravar(join(raiz, "estado", "fontes.json"), JSON.stringify(ordenado(fontes), null, 2) + "\n");
}

export function gravarSondas(raiz: string, sondas: Estado["sondas"]): void {
  gravar(join(raiz, "estado", "sondas.json"), JSON.stringify(ordenado(sondas), null, 2) + "\n");
}

export function chaveSonda(idServico: string, ambiente: string): string {
  return `${idServico}@${ambiente}`;
}
