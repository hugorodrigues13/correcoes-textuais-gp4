import * as MENU from "../../views/mapToRoutes";

export  const ItensModulo = {
  CADASTROS: [
    {key: MENU.DEFEITO, link: "/cad/defeito", label: "defeito"},
    {key: MENU.RECURSO, link: "/cad/recurso", label: "recurso"},
    {key: MENU.GRUPO_RECURSO, link: "/cad/grupoRecurso", label: "grupoRecurso"},
    {key: MENU.LINHA_DE_PRODUCAO, link: "/cad/linhaDeProducao", label: "linhaDeProducao"},
    {key: MENU.GRUPO_LINHA_PRODUCAO, link: "/cad/grupoLinhaProducao", label: "grupoLinhaProducao"},
    {key: MENU.MOTIVO_DE_PARADA, link: "/cad/motivoDeParada", label: "motivoDeParada"},
    {key: MENU.TURNOS, link: "/cad/turno", label: "turnos"},
  ],
  PRODUCAO: [
    {key: MENU.ORDEM_FABRICACAO, link: "/prod/ordemFabricacao", label: "ordemFabricacao"},
    {key: MENU.SERIAL, link: "/prod/serial", label: "serial"},
    {key: MENU.APONTAMENTO, link: "/prod/apontamento", label: "apontamento"},
    {key: MENU.APONTAMENTO_DE_MATERIAL, link: "/prod/apontamentoDeMaterial", label: "apontamentoDeMaterial"},
    {key: MENU.APONTAMENTOS_PENDENTES, link: "/prod/apontamentosPendentes", label: "apontamentosPendentes"},
    {key: MENU.TEMPO_APONTAMENTO, link: "/prod/tempoApontamentoProduto", label: "tempoApontamento"},
    {key: MENU.REIMPRESSAO_ETIQUETAS, link: "/prod/reimpressaoEtiquetas", label: "reimpressaoEtiquetas"},
    {key: MENU.APOIO, link: "/prod/apoio", label: "apoio"},
    {key: MENU.FATURAMENTO, link: "/prod/faturamento", label: "faturamento"},
    {key: MENU.ROMANEIO, link: "/prod/romaneio", label: "romaneio"},
    {key: MENU.PARADAS, link: "/prod/paradas", label: "paradas"},
    {key: MENU.TRANSFORMACAO_LOTE, link: "/prod/transformacaoLote", label: "transformacaoLote"},
  ],
  APONTAMENTO: [
    {key: MENU.APONTAMENTO, link: "/prod/apontamento", label: "apontamento"},
  ],
  PROGRAMACAO: [
    {key: MENU.GERACAO_ORDEM_DE_PRODUCAO, link: "/prog/geracaoOrdemDeProducao", label: "geracaoOrdemDeProducao"},
    {key: MENU.ACOMPANHAMENTO, link: "/prog/acompanhamentoOrdemProducao", label: "acompanhamentoOrdemProducao"},
    {key: MENU.SEQUENCIAMENTO, link: "/prog/sequenciamento", label: "sequenciamento"},
    {key: MENU.ALMOXARIFADO, link: "/prog/almoxarifado", label: "almoxarifado"},
    {key: MENU.PLANEJAMENTO_DIARIO, link: "/prog/planejamentoDiario", label: "planejamentoDiario"},
    {key: MENU.METAS, link: "/prog/metas", label: "metas"},
    {key: MENU.RECEBIMENTO, link: "/prog/recebimento", label: "recebimento"},
  ],
  RELATORIOS: [
    {key: MENU.RELATORIO_SERIAIS, link: "/rel/seriais", label: "serial"},
    {key: MENU.RELATORIO_PRODUCAO, link: "/rel/producao", label: "producao"},
  ],
  AUDITORIA: [
    {key: MENU.AUDIT, link: "/audit/auditoria", label: "entidades"},
    {key: MENU.LOG, link: "/audit/logOperacao", label: "logOperacao"},
  ],
  CONFIGURACOES: [
    {key: MENU.CONECTOR, link: "/config/conector", label: "conector"},
    {key: MENU.CONFIG, link: "/config/confGeral", label: "confGeral"},
    {key: MENU.IMPRESSORA, link: "/config/impressora", label: "impressora"},
    {key: MENU.FORNECEDOR, link: "/config/fornecedor", label: "fornecedor"},
    {key: MENU.PRODUTO_ETIQUETA, link: "/config/produtoEtiqueta", label: "produtoEtiqueta"},
    {key: MENU.CLASSE_POR_PLANEJADOR, link: "/config/classePorPlanejador", label: "classePorPlanejador"},
  ],
  SEGURANCA: [
    {key: MENU.USER, link: "/seg/user", label: "usuarios"},
    {key: MENU.PERFIL, link: "/seg/perfil", label: "perfil"},
    {key: MENU.ACESSO, link: "/seg/acesso", label: "acesso"},
  ]
}

export const acessoNaoHabilitadoPara = (itens, permissoes) => {
  return !itens.some(item => permissoes.includes(item));
}

export const acessoNaoHabilitadoParaModulo = (modulo, permissoes) => {
  return acessoNaoHabilitadoPara(modulo.map(m => m.key), permissoes)
}
