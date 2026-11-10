# Catálogo de serviços fiscais estaduais

Catálogo verificado das APIs, web services e serviços SOAP públicos de cada estado do Brasil, com foco no que um contador usa: documentos fiscais, cadastro, arrecadação, obrigações acessórias, domicílio eletrônico, certidões, registro e tabelas de referência.

O trabalho avança um estado por vez. Um estado só é dado como fechado quando passa num gate automático.

## O que "100%" significa aqui

Não dá para provar que se encontrou tudo num universo aberto. Então o critério é um checklist fechado:

1. **Taxonomia fixa.** `catalogo/taxonomia.yaml` lista os 25 itens que todo estado precisa resolver.
2. **Nenhum item em branco.** Para cada item o estado declara uma resolução: `proprio`, `compartilhado`, `sem_api`, `nao_existe` ou `pendente`. As resoluções `sem_api` e `nao_existe` exigem evidência com link e data.
3. **Três verificações por endpoint:**
   - a URL aparece numa **fonte oficial** coletada automaticamente;
   - o **servidor responde**;
   - o **contrato** (WSDL ou OpenAPI) foi baixado e salvo em `contratos/`, ou o endpoint está marcado como `contrato_restrito` e o servidor de fato recusou por falta de certificado.
4. **Sem lacunas.** Se a fonte oficial publica uma URL no mesmo host que não está no catálogo, o gate não passa.
5. **Dependências verificadas.** Um estado que usa um ambiente compartilhado (SVRS, SVAN, GNRE etc.) num item só fecha quando os serviços desse ambiente para aquele item estão aprovados e há evidência de que o estado realmente usa o ambiente: a relação oficial de UFs do ambiente ou uma evidência no próprio checklist do estado.

Registros vindos de memória ou de fonte secundária (blog, fórum, documentação de fornecedor) entram como candidatos e não contam como confirmados.

## Estrutura

| Caminho | Conteúdo | Quem escreve |
|---|---|---|
| `catalogo/taxonomia.yaml` | Categorias e itens do checklist | Pessoas, por PR |
| `catalogo/nacional/*.yaml` | Ambientes compartilhados entre estados | Pessoas, por PR |
| `catalogo/uf/*.yaml` | Um arquivo por estado, com checklist e serviços | Pessoas, por PR |
| `fontes/fontes.yaml` | Páginas oficiais a coletar | Pessoas, por PR |
| `schema/catalogo.schema.json` | Formato dos arquivos do catálogo | Pessoas, por PR |
| `fontes/snapshots/` | Cópia das páginas oficiais | Automação |
| `estado/` | Resultado da última coleta e da última sonda | Automação |
| `contratos/` | WSDL e OpenAPI baixados | Automação |
| `relatorios/cobertura.md` | Situação de cada endpoint e de cada estado | Automação |

## Comandos

Requer Node 22.18 ou mais novo.

```
npm ci
npm run validar      # schema, referências e status "fechado"
npm run coletar      # baixa as fontes oficiais e extrai as URLs publicadas
npm run sondar       # sonda todos os endpoints (ou: npm run sondar -- svrs)
npm run relatorio    # gera relatorios/cobertura.md
npm run gate -- sp   # diz se um arquivo passa e lista o que falta
npm test
```

A sonda não usa credencial: resolve o DNS, abre a conexão TLS e faz um GET do contrato. Ela não envia nenhum dado fiscal. A chamada real em homologação, que exige certificado digital A1, ainda não está implementada.

## Automação

- **CI** (`.github/workflows/ci.yml`): tipos, testes e validação a cada push e PR. Um arquivo marcado como `fechado` que deixe de passar no gate quebra o CI.
- **Coleta e sondas** (`.github/workflows/coleta-sondas.yml`): roda toda segunda-feira, a cada mudança no catálogo e sob demanda. Grava o resultado de volta no branch. Uma mudança em `estado/fontes.json` significa que um órgão alterou sua relação de serviços.

## Como fechar um estado

1. Criar `catalogo/uf/<sigla>.yaml` com todos os itens do checklist como `pendente`.
2. Acrescentar em `fontes/fontes.yaml` as páginas oficiais da SEFAZ daquele estado.
3. Rodar a coleta e cadastrar cada URL que aparecer em "URLs oficiais fora do catálogo".
4. Resolver item por item do checklist, com evidência.
5. Rodar `npm run gate -- <sigla>` até não sobrar pendência.
6. Mudar `status` para `fechado` e abrir o PR do estado.

## Situação

Fase 0 (fundação e ambientes compartilhados) em andamento. O estado atual, endpoint por endpoint, está em [`relatorios/cobertura.md`](relatorios/cobertura.md).
