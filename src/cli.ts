import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { carregarCatalogo } from "./catalogo.ts";
import type { Catalogo } from "./catalogo.ts";
import { carregarDescartes, carregarFontes, coletarFonte } from "./coleta.ts";
import { carregarEstado, chaveSonda, gravar, gravarFontes, gravarSondas } from "./estado.ts";
import { analisar, gerarMarkdown } from "./relatorio.ts";
import { emParalelo, sondarComRepeticao } from "./sonda.ts";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = process.env.ORIGEM_SONDA ?? (process.env.GITHUB_ACTIONS ? "github-actions" : "local");

function catalogoValido(): Catalogo {
  const catalogo = carregarCatalogo(RAIZ);
  if (catalogo.erros.length > 0) {
    for (const e of catalogo.erros) console.error(`erro: ${e}`);
    console.error(`\n${catalogo.erros.length} erro(s) no catálogo.`);
    process.exit(1);
  }
  return catalogo;
}

function validar(): void {
  const catalogo = catalogoValido();
  const analise = analisar(catalogo, carregarEstado(RAIZ));
  // "fechado" é uma afirmação de que o gate passa; o CI não deixa essa afirmação ficar falsa.
  const falsos = analise.gates.filter((g) => g.arquivo.status === "fechado" && !g.aprovado);
  for (const g of falsos) {
    console.error(`erro: ${g.arquivo.caminho} está como "fechado" mas tem ${g.pendencias.length} pendência(s):`);
    for (const p of g.pendencias) console.error(`  - ${p}`);
  }
  if (falsos.length > 0) process.exit(1);
  const servicos = catalogo.arquivos.reduce((n, a) => n + a.servicos.length, 0);
  console.log(`Catálogo válido: ${catalogo.arquivos.length} arquivo(s), ${servicos} serviço(s), ${catalogo.itens.length} itens na taxonomia.`);
}

async function coletar(args: string[]): Promise<void> {
  const estrito = args.includes("--estrito");
  const fontes = carregarFontes(RAIZ);
  const estado = carregarEstado(RAIZ);
  const novo: typeof estado.fontes = {};
  let falhas = 0;

  const descartes = carregarDescartes(RAIZ);
  const resultados = await emParalelo(fontes, 4, (f) => coletarFonte(f, { descartes }));
  fontes.forEach((fonte, i) => {
    const { estado: atual, corpo } = resultados[i]!;
    const anterior = estado.fontes[fonte.id];
    const instantaneo = join(RAIZ, "fontes", "snapshots", `${fonte.id}.html`);
    if (!atual.ok) {
      falhas++;
      console.log(`falhou  ${fonte.id}: ${atual.erro}`);
      // Mantém a última relação boa: uma falha de rede não apaga o que já foi confirmado.
      novo[fonte.id] =
        anterior?.ok && anterior.url === fonte.url
          ? { ...anterior, falha_recente: { em: atual.coletado_em, erro: atual.erro ?? "?" } }
          : atual;
      return;
    }
    const mudou = anterior?.urls_sha256 !== atual.urls_sha256;
    // A página bruta muda a cada acesso (tokens de sessão); só regrava quando a relação de URLs muda.
    if (corpo && (mudou || !existsSync(instantaneo))) gravar(instantaneo, corpo);
    novo[fonte.id] = atual;
    console.log(`ok      ${fonte.id}: ${atual.urls_servico.length} URL(s)${mudou && anterior ? " — relação mudou" : ""}`);
  });

  gravarFontes(RAIZ, novo);
  console.log(`\n${fontes.length - falhas} de ${fontes.length} fonte(s) coletada(s).`);
  if (estrito && falhas > 0) process.exit(1);
}

async function sondar(args: string[]): Promise<void> {
  const filtro = args.filter((a) => !a.startsWith("--"));
  const catalogo = catalogoValido();
  const estado = carregarEstado(RAIZ);
  const alvos = catalogo.arquivos
    .filter((a) => filtro.length === 0 || filtro.includes(a.id))
    .flatMap((a) => a.servicos.flatMap((s) => s.endpoints.map((e) => ({ servico: s, endpoint: e }))));
  if (alvos.length === 0) {
    console.log("Nenhum endpoint para sondar.");
    return;
  }

  // Um host por vez dentro de cada fila: rajadas no mesmo servidor fazem alguns derrubarem a conexão.
  const porHost = new Map<string, typeof alvos>();
  for (const alvo of alvos) {
    const host = new URL(alvo.endpoint.url).host;
    porHost.set(host, [...(porHost.get(host) ?? []), alvo]);
  }
  type Saida = Awaited<ReturnType<typeof sondarComRepeticao>>;
  const saidas = new Map<(typeof alvos)[number], Saida>();
  await emParalelo([...porHost.values()], 8, async (fila) => {
    for (const alvo of fila) saidas.set(alvo, await sondarComRepeticao(alvo.servico, alvo.endpoint, { origem: ORIGEM }));
  });
  const contagem = new Map<string, number>();
  alvos.forEach((alvo) => {
    const { servico, endpoint } = alvo;
    const { resultado, corpoContrato } = saidas.get(alvo)!;
    estado.sondas[chaveSonda(servico.id, endpoint.ambiente)] = resultado;
    contagem.set(resultado.diagnostico, (contagem.get(resultado.diagnostico) ?? 0) + 1);
    if (corpoContrato && resultado.contrato) {
      const ext = resultado.contrato.tipo === "wsdl" ? "wsdl" : "json";
      gravar(join(RAIZ, "contratos", servico.id, `${endpoint.ambiente}.${ext}`), corpoContrato);
    }
    console.log(`${resultado.diagnostico.padEnd(26)} ${servico.id}@${endpoint.ambiente}`);
  });

  // Remove sondas de endpoints que saíram do catálogo.
  const existentes = new Set(
    catalogo.arquivos.flatMap((a) => a.servicos.flatMap((s) => s.endpoints.map((e) => chaveSonda(s.id, e.ambiente)))),
  );
  for (const chave of Object.keys(estado.sondas)) if (!existentes.has(chave)) delete estado.sondas[chave];

  gravarSondas(RAIZ, estado.sondas);
  console.log(`\n${alvos.length} endpoint(s) sondado(s) a partir de "${ORIGEM}":`);
  for (const [d, n] of [...contagem].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${d}`);
}

function relatorio(): void {
  const catalogo = catalogoValido();
  const estado = carregarEstado(RAIZ);
  const analise = analisar(catalogo, estado);
  gravar(join(RAIZ, "relatorios", "cobertura.md"), gerarMarkdown(catalogo, estado, analise));
  const aprovados = analise.gates.filter((g) => g.aprovado).length;
  console.log(`relatorios/cobertura.md gerado: ${aprovados} de ${analise.gates.length} arquivo(s) passam no gate; ${analise.lacunas.length} URL(s) oficial(is) fora do catálogo.`);
}

function gate(args: string[]): void {
  const catalogo = catalogoValido();
  const analise = analisar(catalogo, carregarEstado(RAIZ));
  const ids = args.filter((a) => !a.startsWith("--")).map((a) => a.toLowerCase());
  if (ids.length === 0) {
    console.error("uso: npm run gate -- <id do arquivo> [...]   (ex.: npm run gate -- svrs sp)");
    process.exit(2);
  }
  let falhou = false;
  for (const id of ids) {
    const g = analise.gates.find((x) => x.arquivo.id === id);
    if (!g) {
      console.error(`${id}: não existe no catálogo`);
      falhou = true;
      continue;
    }
    if (g.aprovado) {
      console.log(`${id}: PASSA (${g.verificacoes.length} endpoint(s) verificados)`);
    } else {
      falhou = true;
      console.log(`${id}: NÃO PASSA — ${g.pendencias.length} pendência(s):`);
      for (const p of g.pendencias) console.log(`  - ${p}`);
    }
  }
  if (falhou) process.exit(1);
}

const [comando, ...resto] = process.argv.slice(2);
switch (comando) {
  case "validar":
    validar();
    break;
  case "coletar":
    await coletar(resto);
    break;
  case "sondar":
    await sondar(resto);
    break;
  case "relatorio":
    relatorio();
    break;
  case "gate":
    gate(resto);
    break;
  default:
    console.error("uso: node src/cli.ts <validar|coletar|sondar|relatorio|gate>");
    process.exit(2);
}
