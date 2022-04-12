package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.dtos.Periodo
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao
import groovy.transform.ToString

@ToString(includeNames= true)
class FiltroOrdemFabricacao extends Filtro {

    String ordemFabricacao
    String codigoProduto
    String descricaoProduto
    String comentarios
    List<StatusOrdemFabricacao> status
    List<StatusOrdemDeProducaoWIP> statusWIP
    String grupoLinhasProducao
    String linhaProducao
    Periodo dataCriacao
    String[] ordemProducao
    String justificativa
    Long quantidadeProgramada
    Long quantidadeProduzida
    String cliente
    String comprimento
    Periodo dataPrevisaoFinalizacao
    Ordenacao ordenacao
    Paginacao paginacao

    FiltroOrdemFabricacao(Map params) {
        super(params)
    }

    @Override
    protected customizarProp(String prop, Object valor) {
        switch (prop){
            case "status":
                return valor
                        ? (valor as String).split(";").collect { StatusOrdemFabricacao.valueOf(it)}
                        : StatusOrdemFabricacao.getFiltroStatusPadrao()
            case "statusWIP":
                return valor
                        ? (valor as String).split(';').collect { StatusOrdemDeProducaoWIP.valueOf(it)}
                        : StatusOrdemDeProducaoWIP.getStatusVisiveisPadrao()
            case "quantidadeProgramada":
            case "quantidadeProduzida":
                return valor?.isNumber() ? valor.toLong() : 0L
            case "ordemProducao":
                return valor ? (valor as String).split("-") : null
            default:
                return valor
        }
    }

    @Override
    String traduzirPropParaColuna(String prop) {
        switch (prop){
            case 'ordemFabricacao':
                return "gof.numero || '-' || gof.ano"
            case 'codigoProduto':
                return 'gof.codigo_produto'
            case 'descricaoProduto':
                return 'nvl(prod.descricao, gop.descricao_produto)'
            case 'grupoLinhasProducao':
                return 'gldp.nome'
            case 'linhaProducao':
                return 'ldp.nome'
            case 'ordemProducao':
                return "gopf.prefixo_producao || '-' || gop.numero"
            case 'comentarios':
                return 'gof.comentarios'
            case 'status':
                return 'gof.status'
            case 'statusWIP':
                return 'gop.status_wip'
            case 'justificativa':
                return 'gop.justificativa'
            case 'dataCriacao':
                return 'gof.data_criacao'
            case 'ordemSequenciamento':
                return 'gof.ordem'
            case 'cliente':
                return 'client.valor'
            case 'comprimento':
                return 'comp.valor'
            case 'quantidadeProgramada':
                return 'gof.quantidade_total'
            case 'quantidadeProduzida':
                return "(SELECT COUNT(*) FROM SERIAL_FABRICACAO s WHERE s.ORDEM_DE_FABRICACAO_ID = gof.id AND s.STATUS_SERIAL = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO.name()}')"
            case 'dataPrevisaoFinalizacao':
                return 'gop.data_previsao_finalizacao'
            default:
                return prop
        }
    }

    @Override
    protected getPeriodoFormato(String prop) {
        switch (prop) {
            case "dataCriacao":
                return "dd/MM/yyyy HH:mm"
            case "dataPrevisaoFinalizacao":
                return "dd/MM/yyyy"
        }
    }

    @Override
    protected String getSortPadrao() {
        return "ordemFabricacao"
    }

    @Override
    String gerarOrderBy(){
        Ordenacao ordenacao = this.ordenacao
        String sort = ""
        switch (ordenacao.sort) {
            case "dataCriacao":
                sort = "to_date(dataCriacao, 'DD/MM/YYYY HH24:MI')"
                break
            case "dataPrevisaoFinalizacao":
                sort = "to_date(dataPrevisaoFinalizacao, 'DD/MM/YYYY')"
                break
            default:
                sort = ordenacao.sort
        }

        return "ORDER BY ${sort} ${ordenacao.order}"
    }
}
