# Cobertura do catálogo

Gerado por `npm run relatorio` a partir de `catalogo/` e `estado/`. Não editar à mão.

- Última coleta de fontes oficiais: 2026-11-10
- Última sonda: 2026-11-10
- Endpoints no catálogo: 128
- Confirmados em fonte oficial: 111
- Servidor respondeu: 118
- Contrato obtido: 0
- Aprovados em tudo: 106
- URLs oficiais fora do catálogo: 429

## Arquivos

| Arquivo | Escopo | Status | Endpoints | Aprovados | Pendências | Gate |
|---|---|---|---:|---:|---:|---|
| an | nacional | em_andamento | 6 | 0 | 10 | não passa |
| gnre | nacional | em_andamento | 6 | 0 | 13 | não passa |
| svan | nacional | em_andamento | 12 | 12 | 1 | não passa |
| svc-an | nacional | em_andamento | 10 | 0 | 31 | não passa |
| svc-rs | nacional | em_andamento | 10 | 10 | 1 | não passa |
| svrs | nacional | em_andamento | 84 | 84 | 8 | não passa |

## Fontes oficiais

| Fonte | Situação | URLs encontradas | Coletado em |
|---|---|---:|---|
| cte-portal-producao | ok | 53 | 2026-11-10 |
| gnre-automacao | falhou (HTTP 403) | 0 | 2026-11-10 |
| gnre-automacao-homologacao | falhou (HTTP 403) | 0 | 2026-11-10 |
| nfe-portal-homologacao | ok | 102 | 2026-11-10 |
| nfe-portal-producao | ok | 105 | 2026-11-10 |
| svrs-bpe | ok | 60 | 2026-11-10 |
| svrs-cte | ok | 92 | 2026-11-10 |
| svrs-mdfe | ok | 13 | 2026-11-10 |
| svrs-nf3e | ok | 46 | 2026-11-10 |
| svrs-nfce | ok | 102 | 2026-11-10 |
| svrs-nfcom | ok | 37 | 2026-11-10 |
| svrs-nfe | ok | 159 | 2026-11-10 |

## Ambiente Nacional (AN) (`an`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `an.nfe.distribuicao_dfe` | producao | coletada (nfe-portal-producao) | sim | não obtido | acesso_negado |
| `an.nfe.distribuicao_dfe` | homologacao | coletada (nfe-portal-homologacao) | sim | não obtido | acesso_negado |
| `an.nfe.recepcao_evento` | producao | coletada (nfe-portal-producao) | sim | não obtido | acesso_negado |
| `an.nfe.recepcao_evento` | homologacao | coletada (nfe-portal-homologacao) | sim | não obtido | acesso_negado |
| `an.cte.distribuicao_dfe` | producao | coletada (cte-portal-producao) | sim | não obtido | acesso_negado |
| `an.cte.distribuicao_dfe` | homologacao | não | sim | não obtido | acesso_negado |

Pendências do arquivo:

- fonte oficial lista https://www.nfe.fazenda.gov.br/agendamentosvc, que não está no catálogo
- relação de UFs atendidas em documentos_fiscais.nfe não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.cte não confirmada em fonte oficial

## Portal GNRE (`gnre`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `gnre.gnre.lote_recepcao` | producao | não | sim | não obtido | acesso_negado |
| `gnre.gnre.lote_recepcao` | homologacao | não | sim | não obtido | acesso_negado |
| `gnre.gnre.resultado_lote` | producao | não | sim | não obtido | acesso_negado |
| `gnre.gnre.resultado_lote` | homologacao | não | sim | não obtido | acesso_negado |
| `gnre.gnre.config_uf` | producao | não | sim | não obtido | acesso_negado |
| `gnre.gnre.config_uf` | homologacao | não | sim | não obtido | acesso_negado |

Pendências do arquivo:

- relação de UFs atendidas em arrecadacao.gnre não confirmada em fonte oficial

## SEFAZ Virtual do Ambiente Nacional (SVAN) (`svan`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `svan.nfe.autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.ret_autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.ret_autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.consulta_protocolo` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.consulta_protocolo` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.inutilizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.inutilizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.status_servico` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.status_servico` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.recepcao_evento` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svan.nfe.recepcao_evento` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |

Pendências do arquivo:

- relação de UFs atendidas em documentos_fiscais.nfe não confirmada em fonte oficial

## SEFAZ Virtual de Contingência do Ambiente Nacional (SVC-AN) (`svc-an`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `svc-an.nfe.autorizacao` | producao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.autorizacao` | homologacao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.ret_autorizacao` | producao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.ret_autorizacao` | homologacao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.consulta_protocolo` | producao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.consulta_protocolo` | homologacao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.status_servico` | producao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.status_servico` | homologacao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.recepcao_evento` | producao | não | não | não obtido | dns_falhou |
| `svc-an.nfe.recepcao_evento` | homologacao | não | não | não obtido | dns_falhou |

Pendências do arquivo:

- relação de UFs atendidas em documentos_fiscais.nfe não confirmada em fonte oficial

## SEFAZ Virtual de Contingência do Rio Grande do Sul (SVC-RS) (`svc-rs`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `svc-rs.nfe.autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.ret_autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.ret_autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.consulta_protocolo` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.consulta_protocolo` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.status_servico` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.status_servico` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.recepcao_evento` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svc-rs.nfe.recepcao_evento` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |

Pendências do arquivo:

- relação de UFs atendidas em documentos_fiscais.nfe não confirmada em fonte oficial

## SEFAZ Virtual do Rio Grande do Sul (SVRS) (`svrs`)

| Serviço | Ambiente | Fonte oficial | Responde | Contrato | Diagnóstico da sonda |
|---|---|---|---|---|---|
| `svrs.nfe.autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.ret_autorizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.ret_autorizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.consulta_protocolo` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.consulta_protocolo` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.inutilizacao` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.inutilizacao` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.status_servico` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.status_servico` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.recepcao_evento` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfe.recepcao_evento` | homologacao | coletada (nfe-portal-homologacao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.autorizacao` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.autorizacao` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.ret_autorizacao` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.ret_autorizacao` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.consulta_protocolo` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.consulta_protocolo` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.inutilizacao` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.inutilizacao` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.status_servico` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.status_servico` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.recepcao_evento` | producao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfce.recepcao_evento` | homologacao | coletada (svrs-nfce) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.consulta_cadastro.consulta_cadastro` | producao | coletada (nfe-portal-producao, svrs-nfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_sinc` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_sinc` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_simp` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_simp` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_os` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_os` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_gtve` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_gtve` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.consulta` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.consulta` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.status_servico` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.status_servico` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_evento` | producao | coletada (cte-portal-producao, svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.recepcao_evento` | homologacao | coletada (svrs-cte) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.recepcao_sinc` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.recepcao_sinc` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.consulta` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.consulta` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.status_servico` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.status_servico` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.recepcao_evento` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.recepcao_evento` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.cons_nao_enc` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.cons_nao_enc` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.distribuicao_dfe` | producao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.mdfe.distribuicao_dfe` | homologacao | coletada (svrs-mdfe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_tm` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_tm` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_ta` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_ta` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.consulta` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.consulta` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.status_servico` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.status_servico` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_evento` | producao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.bpe.recepcao_evento` | homologacao | coletada (svrs-bpe) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.recepcao_sinc` | producao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.recepcao_sinc` | homologacao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.consulta` | producao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.consulta` | homologacao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.status_servico` | producao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.status_servico` | homologacao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.recepcao_evento` | producao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nf3e.recepcao_evento` | homologacao | coletada (svrs-nf3e) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.recepcao` | producao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.recepcao` | homologacao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.consulta` | producao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.consulta` | homologacao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.status_servico` | producao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.status_servico` | homologacao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.recepcao_evento` | producao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.nfcom.recepcao_evento` | homologacao | coletada (svrs-nfcom) | sim | restrito (exige certificado) | acesso_negado |
| `svrs.cte.qrcode` | producao | coletada (cte-portal-producao, svrs-cte) | sim | não se aplica | http_200_sem_contrato |
| `svrs.mdfe.qrcode` | producao | coletada (svrs-mdfe) | sim | não se aplica | http_200_sem_contrato |
| `svrs.bpe.qrcode` | producao | coletada (svrs-bpe) | sim | não se aplica | http_200_sem_contrato |
| `svrs.nf3e.qrcode` | producao | coletada (svrs-nf3e) | sim | não se aplica | http_200_sem_contrato |
| `svrs.nfcom.qrcode` | producao | coletada (svrs-nfcom) | sim | não se aplica | http_200_sem_contrato |

Pendências do arquivo:

- relação de UFs atendidas em documentos_fiscais.nfe não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.nfce não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.cte não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.mdfe não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.bpe não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.nf3e não confirmada em fonte oficial
- relação de UFs atendidas em documentos_fiscais.nfcom não confirmada em fonte oficial
- relação de UFs atendidas em cadastro.consulta_cadastro não confirmada em fonte oficial

## URLs oficiais fora do catálogo

Publicadas em fonte oficial coletada e ainda sem registro. Cada uma precisa virar serviço no catálogo ou ser descartada com justificativa.

| URL | Fonte |
|---|---|
| http://exslt.org/chaveacesso | nfe-portal-homologacao, nfe-portal-producao |
| http://fazenda.rs.gov.br/inicial | nfe-portal-homologacao, nfe-portal-producao |
| http://internet.sefaz.es.gov.br/informacoes/nfe | nfe-portal-homologacao, nfe-portal-producao |
| http://receita.fazenda.rs.gov.br/lista/2933/nf-e- | nfe-portal-homologacao, nfe-portal-producao |
| http://sefaznet.ac.gov.br/nfe | nfe-portal-homologacao, nfe-portal-producao |
| http://sistemas.sefaz.am.gov.br/nfeweb/portal/index.do | nfe-portal-homologacao, nfe-portal-producao |
| http://www.dfe.ms.gov.br/bpe/qrcode | svrs-bpe |
| http://www.dfe.ms.gov.br/cte/qrcode | cte-portal-producao, svrs-cte |
| http://www.fazenda.pr.gov.br/cte/qrcode | cte-portal-producao, svrs-cte |
| http://www.fazenda.rj.gov.br/sefaz/faces/webcenter/faces/owresource.jspx | nfe-portal-homologacao, nfe-portal-producao |
| http://www.fazenda.sp.gov.br/nfe | nfe-portal-homologacao, nfe-portal-producao |
| http://www.receita.pb.gov.br/bpe/qrcode | svrs-bpe |
| http://www.sefa.pa.gov.br/index.php/component/banners/click/7 | nfe-portal-producao |
| http://www.sefa.pa.gov.br/site | nfe-portal-homologacao |
| http://www.sefaz.al.gov.br/nfe | nfe-portal-homologacao, nfe-portal-producao |
| http://www.sefaz.ba.gov.br/scripts/default/cte.asp | cte-portal-producao |
| http://www.sefaz.ba.gov.br/scripts/default/nfiscal.asp | nfe-portal-producao |
| http://www.sefaz.mt.gov.br/portal/cte | cte-portal-producao |
| http://www.sefaz.mt.gov.br/portal/nfe | nfe-portal-homologacao, nfe-portal-producao |
| http://www.set.rn.gov.br/contentproducao/aplicacao/set_v2/nfe/gerados/inicio.asp | nfe-portal-homologacao, nfe-portal-producao |
| http://www2.sefin.ro.gov.br/manual/mostrar.asp | nfe-portal-homologacao |
| https://bpe.fazenda.mg.gov.br/bpe/services/bpeconsulta | svrs-bpe |
| https://bpe.fazenda.mg.gov.br/bpe/services/bperecepcao | svrs-bpe |
| https://bpe.fazenda.mg.gov.br/bpe/services/bperecepcaoevento | svrs-bpe |
| https://bpe.fazenda.mg.gov.br/bpe/services/bperecepcaotm | svrs-bpe |
| https://bpe.fazenda.mg.gov.br/bpe/services/bpestatusservico | svrs-bpe |
| https://bpe.fazenda.ms.gov.br/ws/bpeconsulta | svrs-bpe |
| https://bpe.fazenda.ms.gov.br/ws/bperecepcao | svrs-bpe |
| https://bpe.fazenda.ms.gov.br/ws/bperecepcaoevento | svrs-bpe |
| https://bpe.fazenda.ms.gov.br/ws/bpestatusservico | svrs-bpe |
| https://bpe.fazenda.pr.gov.br/bpe/bpeconsulta | svrs-bpe |
| https://bpe.fazenda.pr.gov.br/bpe/bperecepcao | svrs-bpe |
| https://bpe.fazenda.pr.gov.br/bpe/bperecepcaoevento | svrs-bpe |
| https://bpe.fazenda.pr.gov.br/bpe/bpestatusservico | svrs-bpe |
| https://bpe.fazenda.sp.gov.br/bpe/qrcode | svrs-bpe |
| https://bpe.fazenda.sp.gov.br/bpeweb/services/bpeconsulta.asmx | svrs-bpe |
| https://bpe.fazenda.sp.gov.br/bpeweb/services/bperecepcao.asmx | svrs-bpe |
| https://bpe.fazenda.sp.gov.br/bpeweb/services/bperecepcaoevento.asmx | svrs-bpe |
| https://bpe.fazenda.sp.gov.br/bpeweb/services/bpestatusservico.asmx | svrs-bpe |
| https://cad-homologacao.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx | nfe-portal-homologacao |
| https://cte.fazenda.mg.gov.br/cte/services/cteconsultav4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/cterecepcaoeventov4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/cterecepcaogtvev4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/cterecepcaoosv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/cterecepcaosimpv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/cterecepcaosincv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.mg.gov.br/cte/services/ctestatusservicov4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cteconsultav4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cterecepcaoeventov4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cterecepcaogtvev4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cterecepcaoosv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cterecepcaosimpv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/cterecepcaosincv4 | cte-portal-producao, svrs-cte |
| https://cte.fazenda.pr.gov.br/cte4/ctestatusservicov4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/cte-ws/services/cterecepcaosimpv4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews/services/cterecepcaoosv4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews2/services/cteconsultav4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews2/services/cterecepcaoeventov4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews2/services/cterecepcaogtvev4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews2/services/cterecepcaosincv4 | cte-portal-producao, svrs-cte |
| https://cte.sefaz.mt.gov.br/ctews2/services/ctestatusservicov4 | cte-portal-producao, svrs-cte |
| https://hbpe.fazenda.mg.gov.br/bpe/services/bpeconsulta | svrs-bpe |
| https://hbpe.fazenda.mg.gov.br/bpe/services/bperecepcao | svrs-bpe |
| https://hbpe.fazenda.mg.gov.br/bpe/services/bperecepcaoevento | svrs-bpe |
| https://hbpe.fazenda.mg.gov.br/bpe/services/bperecepcaotm | svrs-bpe |
| https://hcte.fazenda.mg.gov.br/cte/services/cteconsultav4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/cterecepcaoeventov4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/cterecepcaogtvev4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/cterecepcaoosv4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/cterecepcaosimpv4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/cterecepcaosincv4 | svrs-cte |
| https://hcte.fazenda.mg.gov.br/cte/services/ctestatusservicov4 | svrs-cte |
| https://hnf3e.fazenda.mg.gov.br/nf3e/services/nf3econsulta | svrs-nf3e |
| https://hnf3e.fazenda.mg.gov.br/nf3e/services/nf3erecepcaoevento | svrs-nf3e |
| https://hnf3e.fazenda.mg.gov.br/nf3e/services/nf3erecepcaosinc | svrs-nf3e |
| https://hnf3e.fazenda.mg.gov.br/nf3e/services/nf3estatusservico | svrs-nf3e |
| https://hnfcom.fazenda.mg.gov.br/nfcom/services/nfcomconsulta | svrs-nfcom |
| https://hnfcom.fazenda.mg.gov.br/nfcom/services/nfcomrecepcao | svrs-nfcom |
| https://hnfcom.fazenda.mg.gov.br/nfcom/services/nfcomrecepcaoevento | svrs-nfcom |
| https://hnfcom.fazenda.mg.gov.br/nfcom/services/nfcomstatusservico | svrs-nfcom |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/cadconsultacadastro4 | nfe-portal-homologacao |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nfeconsultaprotocolo4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nferecepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.fazenda.mg.gov.br/nfe2/services/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/cadconsultacadastro4/cadconsultacadastro4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nfeautorizacao4/nfeautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nfeconsultaprotocolo4/nfeconsultaprotocolo4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nfeinutilizacao4/nfeinutilizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nferecepcaoevento4/nferecepcaoevento4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nferetautorizacao4/nferetautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hnfe.sefaz.ba.gov.br/webservices/nfestatusservico4/nfestatusservico4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://hom.nf3e.sefaz.ms.gov.br/ws/nf3econsulta | svrs-nf3e |
| https://hom.nf3e.sefaz.ms.gov.br/ws/nf3erecepcaoevento | svrs-nf3e |
| https://hom.nf3e.sefaz.ms.gov.br/ws/nf3erecepcaosinc | svrs-nf3e |
| https://hom.nf3e.sefaz.ms.gov.br/ws/nf3estatusservico | svrs-nf3e |
| https://hom.nfce.sefaz.ms.gov.br/ws/nfeautorizacao4 | svrs-nfce |
| https://hom.nfce.sefaz.ms.gov.br/ws/nfeconsultaprotocolo4 | svrs-nfce |
| https://hom.nfce.sefaz.ms.gov.br/ws/nfeinutilizacao4 | svrs-nfce |
| https://hom.nfce.sefaz.ms.gov.br/ws/nferecepcaoevento4 | svrs-nfce |
| https://hom.nfce.sefaz.ms.gov.br/ws/nferetautorizacao4 | svrs-nfce |
| https://hom.nfce.sefaz.ms.gov.br/ws/nfestatusservico4 | svrs-nfce |
| https://hom.nfcom.sefaz.ms.gov.br/ws/nfcomconsulta | svrs-nfcom |
| https://hom.nfcom.sefaz.ms.gov.br/ws/nfcomrecepcao | svrs-nfcom |
| https://hom.nfcom.sefaz.ms.gov.br/ws/nfcomrecepcaoevento | svrs-nfcom |
| https://hom.nfcom.sefaz.ms.gov.br/ws/nfcomstatusservico | svrs-nfcom |
| https://hom.nfe.fazenda.gov.br/arearestrita/inicial/autenticacao.aspx& | nfe-portal-homologacao, nfe-portal-producao |
| https://hom.nfe.sefaz.ms.gov.br/ws/cadconsultacadastro4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nfeconsultaprotocolo4 | nfe-portal-homologacao, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nferecepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://hom.nfe.sefaz.ms.gov.br/ws/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/nfeautorizacao4 | svrs-nfce |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/nfeconsulta4 | svrs-nfce |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/nfeinutilizacao4 | svrs-nfce |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/nferetautorizacao4 | svrs-nfce |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/nfestatusservico4 | svrs-nfce |
| https://homnfce.sefaz.am.gov.br/nfce-services/services/recepcaoevento4 | svrs-nfce |
| https://homnfe.sefaz.am.gov.br/services2/services/cadconsultacadastro4 | nfe-portal-homologacao |
| https://homnfe.sefaz.am.gov.br/services2/services/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfe.sefaz.am.gov.br/services2/services/nfeconsulta4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfe.sefaz.am.gov.br/services2/services/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfe.sefaz.am.gov.br/services2/services/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfe.sefaz.am.gov.br/services2/services/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://homnfe.sefaz.am.gov.br/services2/services/recepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/cadconsultacadastro4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nfeconsultaprotocolo4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nferecepcaoevento4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homolog.sefaz.go.gov.br/nfe/services/nfestatusservico4 | nfe-portal-homologacao, svrs-nfce, svrs-nfe |
| https://homologacao.bpe.fazenda.pr.gov.br/bpe/bpeconsulta | svrs-bpe |
| https://homologacao.bpe.fazenda.pr.gov.br/bpe/bperecepcao | svrs-bpe |
| https://homologacao.bpe.fazenda.pr.gov.br/bpe/bperecepcaoevento | svrs-bpe |
| https://homologacao.bpe.fazenda.pr.gov.br/bpe/bpestatusservico | svrs-bpe |
| https://homologacao.bpe.fazenda.sp.gov.br/bpe/qrcode | svrs-bpe |
| https://homologacao.bpe.fazenda.sp.gov.br/bpeweb/services/bpeconsulta.asmx | svrs-bpe |
| https://homologacao.bpe.fazenda.sp.gov.br/bpeweb/services/bperecepcao.asmx | svrs-bpe |
| https://homologacao.bpe.fazenda.sp.gov.br/bpeweb/services/bperecepcaoevento.asmx | svrs-bpe |
| https://homologacao.bpe.fazenda.sp.gov.br/bpeweb/services/bpestatusservico.asmx | svrs-bpe |
| https://homologacao.bpe.ms.gov.br/ws/bperecepcao | svrs-bpe |
| https://homologacao.bpe.ms.gov.br/ws/bperecepcaoevento | svrs-bpe |
| https://homologacao.bpe.ms.gov.br/ws/bpestatusservico | svrs-bpe |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cteconsultav4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cterecepcaoeventov4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cterecepcaogtvev4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cterecepcaoosv4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cterecepcaosimpv4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/cterecepcaosincv4 | svrs-cte |
| https://homologacao.cte.fazenda.pr.gov.br/cte4/ctestatusservicov4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cteconsultav4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cterecepcaoeventov4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cterecepcaogtvev4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cterecepcaoosv4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cterecepcaosimpv4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/cterecepcaosincv4 | svrs-cte |
| https://homologacao.cte.ms.gov.br/ws/ctestatusservicov4 | svrs-cte |
| https://homologacao.nf3e.fazenda.pr.gov.br/nf3e/nf3econsulta | svrs-nf3e |
| https://homologacao.nf3e.fazenda.pr.gov.br/nf3e/nf3erecepcaoevento | svrs-nf3e |
| https://homologacao.nf3e.fazenda.pr.gov.br/nf3e/nf3erecepcaosinc | svrs-nf3e |
| https://homologacao.nf3e.fazenda.pr.gov.br/nf3e/nf3estatusservico | svrs-nf3e |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx | svrs-nfce |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx | svrs-nfce |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx | svrs-nfce |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx | svrs-nfce |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx | svrs-nfce |
| https://homologacao.nfce.fazenda.sp.gov.br/ws/nfestatusservico4.asmx | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/cadconsultacadastro4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nfeautorizacao4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nfeconsultaprotocolo4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nfeinutilizacao4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nferecepcaoevento4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nferetautorizacao4 | svrs-nfce |
| https://homologacao.nfce.sefa.pr.gov.br/nfce/nfestatusservico4 | svrs-nfce |
| https://homologacao.nfe.fazenda.sp.gov.br/cteconsulta/qrcode | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cteconsultav4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaoeventov4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaogtvev4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaoosv4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaosimpv4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaosincv4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ctews/ws/ctestatusservicov4.asmx | svrs-cte |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/cadconsultacadastro4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nfeconsultaprotocolo4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nferecepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.nfe.sefa.pr.gov.br/nfe/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/bpe-ws/services/bpeconsulta | svrs-bpe |
| https://homologacao.sefaz.mt.gov.br/bpe-ws/services/bperecepcao | svrs-bpe |
| https://homologacao.sefaz.mt.gov.br/bpe-ws/services/bperecepcaoevento | svrs-bpe |
| https://homologacao.sefaz.mt.gov.br/bpe-ws/services/bpestatusservico | svrs-bpe |
| https://homologacao.sefaz.mt.gov.br/bpe/qrcode | svrs-bpe |
| https://homologacao.sefaz.mt.gov.br/cte-ws/services/cterecepcaosimpv4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/cte/qrcode | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews/services/cterecepcaoosv4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews2/services/cteconsultav4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews2/services/cterecepcaoeventov4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews2/services/cterecepcaogtvev4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews2/services/cterecepcaosincv4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/ctews2/services/ctestatusservicov4 | svrs-cte |
| https://homologacao.sefaz.mt.gov.br/nf3e/qrcode | svrs-nf3e |
| https://homologacao.sefaz.mt.gov.br/nf3ews/services/nf3econsultanf | svrs-nf3e |
| https://homologacao.sefaz.mt.gov.br/nf3ews/services/nf3erecepcao | svrs-nf3e |
| https://homologacao.sefaz.mt.gov.br/nf3ews/services/nf3erecepcaoevento | svrs-nf3e |
| https://homologacao.sefaz.mt.gov.br/nf3ews/services/nf3estatusservico | svrs-nf3e |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/nfeautorizacao4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/nfeconsulta4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/nfeinutilizacao4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/nferetautorizacao4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/nfestatusservico4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcews/services/recepcaoevento4 | svrs-nfce |
| https://homologacao.sefaz.mt.gov.br/nfcom-ext-fe/qrcode | svrs-nfcom |
| https://homologacao.sefaz.mt.gov.br/nfcom/services/nfcomconsulta | svrs-nfcom |
| https://homologacao.sefaz.mt.gov.br/nfcom/services/nfcomrecepcao | svrs-nfcom |
| https://homologacao.sefaz.mt.gov.br/nfcom/services/nfcomrecepcaoevento | svrs-nfcom |
| https://homologacao.sefaz.mt.gov.br/nfcom/services/nfcomstatusservico | svrs-nfcom |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/cadconsultacadastro4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/nfeconsulta4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://homologacao.sefaz.mt.gov.br/nfews/v2/services/recepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://nf3e.fazenda.mg.gov.br/nf3e/services/nf3econsulta | svrs-nf3e |
| https://nf3e.fazenda.mg.gov.br/nf3e/services/nf3erecepcaoevento | svrs-nf3e |
| https://nf3e.fazenda.mg.gov.br/nf3e/services/nf3erecepcaosinc | svrs-nf3e |
| https://nf3e.fazenda.mg.gov.br/nf3e/services/nf3estatusservico | svrs-nf3e |
| https://nf3e.fazenda.pr.gov.br/nf3e/nf3econsulta | svrs-nf3e |
| https://nf3e.fazenda.pr.gov.br/nf3e/nf3erecepcaoevento | svrs-nf3e |
| https://nf3e.fazenda.pr.gov.br/nf3e/nf3erecepcaosinc | svrs-nf3e |
| https://nf3e.fazenda.pr.gov.br/nf3e/nf3estatusservico | svrs-nf3e |
| https://nf3e.sefaz.ms.gov.br/ws/nf3econsulta | svrs-nf3e |
| https://nf3e.sefaz.ms.gov.br/ws/nf3erecepcaoevento | svrs-nf3e |
| https://nf3e.sefaz.ms.gov.br/ws/nf3erecepcaosinc | svrs-nf3e |
| https://nf3e.sefaz.ms.gov.br/ws/nf3estatusservico | svrs-nf3e |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx | svrs-nfce |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfeconsulta/nfeconsulta4.asmx | svrs-nfce |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx | svrs-nfce |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/nferetautorizacao/nferetautorizacao4.asmx | svrs-nfce |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx | svrs-nfce |
| https://nfce-homologacao.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx | svrs-nfce |
| https://nfce.fazenda.sp.gov.br/ws/nfestatusservico4.asmx | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/cadconsultacadastro4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nfeautorizacao4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nfeconsultaprotocolo4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nfeinutilizacao4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nferecepcaoevento4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nferetautorizacao4 | svrs-nfce |
| https://nfce.sefa.pr.gov.br/nfce/nfestatusservico4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/nfeautorizacao4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/nfeconsulta4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/nfeinutilizacao4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/nferetautorizacao4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/nfestatusservico4 | svrs-nfce |
| https://nfce.sefaz.am.gov.br/nfce-services/services/recepcaoevento4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nfeautorizacao4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nfeconsultaprotocolo4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nfeinutilizacao4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nferecepcaoevento4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nferetautorizacao4 | svrs-nfce |
| https://nfce.sefaz.ms.gov.br/ws/nfestatusservico4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/nfeautorizacao4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/nfeconsulta4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/nfeinutilizacao4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/nferetautorizacao4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/nfestatusservico4 | svrs-nfce |
| https://nfce.sefaz.mt.gov.br/nfcews/services/recepcaoevento4 | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/nfeconsulta/nfeconsulta4.asmx | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/nferetautorizacao/nferetautorizacao4.asmx | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx | svrs-nfce |
| https://nfce.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx | svrs-nfce |
| https://nfcom.fazenda.mg.gov.br/nfcom/services/nfcomconsulta | svrs-nfcom |
| https://nfcom.fazenda.mg.gov.br/nfcom/services/nfcomrecepcao | svrs-nfcom |
| https://nfcom.fazenda.mg.gov.br/nfcom/services/nfcomrecepcaoevento | svrs-nfcom |
| https://nfcom.fazenda.mg.gov.br/nfcom/services/nfcomstatusservico | svrs-nfcom |
| https://nfcom.sefaz.ms.gov.br/ws/nfcomconsulta | svrs-nfcom |
| https://nfcom.sefaz.ms.gov.br/ws/nfcomrecepcao | svrs-nfcom |
| https://nfcom.sefaz.ms.gov.br/ws/nfcomrecepcaoevento | svrs-nfcom |
| https://nfcom.sefaz.ms.gov.br/ws/nfcomstatusservico | svrs-nfcom |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeconsulta/nfeconsulta4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/nferetautorizacao/nferetautorizacao4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe-homologacao.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx | nfe-portal-homologacao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/cadconsultacadastro4 | nfe-portal-producao |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nfeconsultaprotocolo4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nferecepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.mg.gov.br/nfe2/services/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/cteconsulta/qrcode | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cteconsultav4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaoeventov4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaogtvev4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaoosv4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaosimpv4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/cterecepcaosincv4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ctews/ws/ctestatusservicov4.asmx | cte-portal-producao, svrs-cte |
| https://nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/cadconsultacadastro4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nfeconsultaprotocolo4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nferecepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefa.pr.gov.br/nfe/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/cadconsultacadastro4 | nfe-portal-producao |
| https://nfe.sefaz.am.gov.br/services2/services/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/nfeconsulta4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.am.gov.br/services2/services/recepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/cadconsultacadastro4/cadconsultacadastro4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nfeautorizacao4/nfeautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nfeconsultaprotocolo4/nfeconsultaprotocolo4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nfeinutilizacao4/nfeinutilizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nferecepcaoevento4/nferecepcaoevento4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nferetautorizacao4/nferetautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ba.gov.br/webservices/nfestatusservico4/nfestatusservico4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/cadconsultacadastro4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nfeautorizacao4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nfeconsultaprotocolo4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nfeinutilizacao4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nferecepcaoevento4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nferetautorizacao4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.go.gov.br/nfe/services/nfestatusservico4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/cadconsultacadastro4 | nfe-portal-producao, svrs-nfce, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nfeconsultaprotocolo4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nferecepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.ms.gov.br/ws/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nf3ews/services/nf3econsultanf | svrs-nf3e |
| https://nfe.sefaz.mt.gov.br/nf3ews/services/nf3erecepcao | svrs-nf3e |
| https://nfe.sefaz.mt.gov.br/nf3ews/services/nf3erecepcaoevento | svrs-nf3e |
| https://nfe.sefaz.mt.gov.br/nf3ews/services/nf3estatusservico | svrs-nf3e |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/cadconsultacadastro4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/nfeconsulta4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.mt.gov.br/nfews/v2/services/recepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/cadconsultacadastro4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nfeautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nfeconsultaprotocolo4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nfeinutilizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nferecepcaoevento4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nferetautorizacao4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefaz.pe.gov.br/nfe-service/services/nfestatusservico4 | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/nfeconsulta/nfeconsulta4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/nferetautorizacao/nferetautorizacao4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfe.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx | nfe-portal-producao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/cadconsultacadastro4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nfeautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nfeconsultaprotocolo4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nfeinutilizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nferecepcaoevento4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nferetautorizacao4 | nfe-portal-homologacao, svrs-nfe |
| https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/nfestatusservico4 | nfe-portal-homologacao, svrs-nfe |
| https://portal.fazenda.sp.gov.br/servicos/cte | cte-portal-producao |
| https://portalbpe.fazenda.mg.gov.br/portalbpe/sistema/qrcode.xhtml | svrs-bpe |
| https://portalcte.fazenda.mg.gov.br/portalcte/sistema/qrcode.xhtml | cte-portal-producao, svrs-cte |
| https://portalnfcom.fazenda.mg.gov.br/qrcode | svrs-nfcom |
| https://portalsped.fazenda.mg.gov.br/portalnf3e/sistema/qrcode.xhtml | svrs-nf3e |
| https://producao.cte.ms.gov.br/ws/cteconsultav4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/cterecepcaoeventov4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/cterecepcaogtvev4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/cterecepcaoosv4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/cterecepcaosimpv4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/cterecepcaosincv4 | cte-portal-producao, svrs-cte |
| https://producao.cte.ms.gov.br/ws/ctestatusservicov4 | cte-portal-producao, svrs-cte |
| https://sat.sef.sc.gov.br/nf3e/consulta | svrs-nf3e |
| https://sathomologa.sef.sc.gov.br/nf3e/consulta | svrs-nf3e |
| https://sistemas1.sefaz.ma.gov.br/portalsefaz/jsp/pagina/pagina.jsf | nfe-portal-homologacao, nfe-portal-producao |
| https://www.dfe.ms.gov.br/nfcom/qrcode | svrs-nfcom |
| https://www.fazenda.pr.gov.br/bpe/qrcode | svrs-bpe |
| https://www.google.com.br/url | nfe-portal-producao |
| https://www.nfe.fazenda.gov.br/agendamentosvc | nfe-portal-producao |
| https://www.sefaz.ap.gov.br/index.php/nf-e | nfe-portal-producao |
| https://www.sefaz.ms.gov.br/documentos-fiscais-eletronicos/ct-e | cte-portal-producao |
| https://www.sefaz.ms.gov.br/documentos-fiscais-eletronicos/nf-e | nfe-portal-homologacao, nfe-portal-producao |
| https://www.sefaz.mt.gov.br/bpe-ws/services/bpeconsulta | svrs-bpe |
| https://www.sefaz.mt.gov.br/bpe-ws/services/bperecepcaoevento | svrs-bpe |
| https://www.sefaz.mt.gov.br/bpe-ws/services/bpestatusservico | svrs-bpe |
| https://www.sefaz.mt.gov.br/bpe/qrcode | svrs-bpe |
| https://www.sefaz.mt.gov.br/cte/qrcode | cte-portal-producao, svrs-cte |
| https://www.sefaz.mt.gov.br/nf3e/qrcode | svrs-nf3e |
| https://www.sefaz.mt.gov.br/nfcom-ext-fe/qrcode | svrs-nfcom |
| https://www.sefaz.mt.gov.br/nfcom/services/nfcomconsulta | svrs-nfcom |
| https://www.sefaz.mt.gov.br/nfcom/services/nfcomrecepcao | svrs-nfcom |
| https://www.sefaz.mt.gov.br/nfcom/services/nfcomrecepcaoevento | svrs-nfcom |
| https://www.sefaz.mt.gov.br/nfcom/services/nfcomstatusservico | svrs-nfcom |
| https://www.sefaz.pb.gov.br/servirtual/documentos-fiscais/nf-e/consulta-completa | nfe-portal-homologacao, nfe-portal-producao |
| https://www.sefaz.rr.gov.br/empresa/consultar-internamento-nf | nfe-portal-homologacao, nfe-portal-producao |
