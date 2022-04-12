package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.dtos.Periodo
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusSerialFabricacao

class FiltroAcompanhamentoOP extends Filtro{

    String fornecedor
    String pedido
    String codigoProduto
    String descricaoProduto
    String lista
    String roteiro
    StatusOrdemProducao status
    List<StatusOrdemDeProducaoWIP> statusOracle
    String release
    String linha
    String codigoServico
    String erroExportacao
    Long quantidade
    Long quantidadeEntregue
    Long quantidadeRestante
    Long quantidadePendenteRomaneio
    Long quantidadeTransito
    String ordemDeProducao
    String planejador
    Periodo dataCriacao
    Periodo dataPrevisaoFinalizacao
    String justificativa
    Long totalSequenciado
    Long totalPecasProducao
    Long totalPecasFinalizadas
    String grupoLinhas
    Ordenacao ordenacao
    Paginacao paginacao

    List<String> userPlanejadores

    FiltroAcompanhamentoOP(Map params, List<String> userPlanejadores) {
        super(params)

        this.userPlanejadores = userPlanejadores

        if(!userPlanejadores.isEmpty() && !params.planejador) this.planejador = 'padrao'
    }

    @Override
    String traduzirPropParaColuna(String prop) {
        switch (prop){
            case 'fornecedor':
                return "f.nome"
            case 'pedido':
                return "op.pedido"
            case 'codigoProduto':
                return "op.codigo_produto"
            case 'descricaoProduto':
                return "nvl(prod.descricao, op.descricao_produto)"
            case 'lista':
                return "op.lista"
            case 'roteiro':
                return "op.roteiro"
            case 'status':
                return "op.status"
            case 'statusOracle':
                return "op.status_wip"
            case 'release':
                return "op.release"
            case 'linha':
                return "op.linha"
            case 'codigoServico':
                return "op.codigo_servico"
            case 'erroExportacao':
                return "op.erro_exportacao"
            case 'quantidade':
                return "op.quantidade"
            case 'quantidadeEntregue':
                return "op.quantidade_entregue"
            case 'quantidadeRestante':
                return "(op.quantidade - op.quantidade_entregue)"
            case 'quantidadePendenteRomaneio':
                return montaSubQueryTotalPecasPendentesRomaneio()
            case 'quantidadeTransito':
                return "(${montaSubQueryTotalPecasEmRomaneio()} - op.quantidade_entregue)"
            case 'ordemDeProducao':
                return "(f.prefixo_producao || '-' || op.numero)"
            case 'planejador':
                return "op.planejador"
            case 'dataCriacao':
                return "op.data_criacao"
            case 'dataPrevisaoFinalizacao':
                return "op.data_previsao_finalizacao"
            case 'justificativa':
                return "op.justificativa"
            case 'totalSequenciado':
                return montaSubQueryTotalSequenciado()
            case 'totalPecasProducao':
                return montaSubQueryTotalPecasProducao()
            case 'totalPecasFinalizadas':
                return montaSubQueryTotalPecasFinalizadas()
            case 'grupoLinhas':
                return montaSubQueryGrupoLinha()
            default:
                return prop
        }
    }

    @Override
    protected Object customizarProp(String prop, Object valor) {
        switch (prop){
            case 'status':
                return valor ? StatusOrdemProducao.valueOf(valor as String) : null
            case 'statusOracle':
                return valor
                        ? (valor as String).split(";").collect({StatusOrdemDeProducaoWIP.valueOf(it)})
                        : StatusOrdemDeProducaoWIP.getStatusVisiveisPadrao()
            case 'quantidade':
            case 'quantidadeEntregue':
            case 'quantidadeRestante':
            case 'quantidadePendenteRomaneio':
            case 'quantidadeTransito':
            case 'totalSequenciado':
            case 'totalPecasProducao':
            case 'totalPecasFinalizadas':
                return valor?.isNumber() ? valor.toLong() : 0L
            default:
                return valor
        }
    }

    @Override
    String traduzirPropParaOrder(String prop) {
        switch(prop){
            case 'ordemDeProducao':
            case 'dataCriacao':
            case 'dataPrevisaoFinalizacao':
                return traduzirPropParaColuna(prop)
            default:
                return prop
        }
    }

    @Override
    String customizarWhere(String prop, Object valor) {
        switch (prop){
            case 'lista':
            case 'roteiro':
                return valor ? (valor == "00" ? " AND ${traduzirPropParaColuna(prop)} IS NULL\n" : " AND UPPER(${traduzirPropParaColuna(prop)}) LIKE UPPER('%${valor}%')\n") : ""
            case 'planejador':
                String planejadorEscolhido = planejador
                        ?: this.userPlanejadores.isEmpty()
                            ? "todos"
                            : "padrao"
                if (planejadorEscolhido == "todos") planejadorEscolhido = ""
                if (planejadorEscolhido == "padrao"){
                    String planejadores = userPlanejadores.collect({"'$it'"}).join(", ")
                    return "AND op.planejador IN (${planejadores})"
                } else {
                    return "AND UPPER(op.planejador) LIKE UPPER('%${planejadorEscolhido}%')"
                }
                return prop
            case 'grupoLinhas':
                return montaWhereGrupoLinha(valor as String)
            case 'statusOracle':
                return "AND (status_wip is null or status_wip in ('${valor.join("', '")}'))"
            default:
                return prop
        }
    }

    @Override
    protected String getSortPadrao() {
        return 'ordemDeProducao'
    }

    @Override
    protected getPeriodoFormato(String prop) {
        return "dd/MM/yyyy HH:mm"
    }

    @Override
    protected List<String> getIgnorado() {
        return super.getIgnorado() + ['userPlanejadores']
    }

    static String montaSubQueryTotalSequenciado(){
        return montaSubQueryTotal([StatusSerialFabricacao.PENDENTE_APONTAMENTO, StatusSerialFabricacao.APONTAMENTO_INICIADO, StatusSerialFabricacao.PENDENTE_APOIO, StatusSerialFabricacao.APONTAMENTO_FINALIZADO])
    }


    static String montaSubQueryTotalPecasProducao(){
        return montaSubQueryTotal([StatusSerialFabricacao.APONTAMENTO_INICIADO, StatusSerialFabricacao.PENDENTE_APOIO])
    }

    static String montaSubQueryTotalPecasFinalizadas(){
        return montaSubQueryTotal([StatusSerialFabricacao.APONTAMENTO_FINALIZADO])
    }

    static String montaSubQueryTotalPecasPendentesRomaneio(){
        return """
            (
                SELECT COUNT(ser.ID)
                FROM SERIAL_FABRICACAO ser
                    INNER JOIN ORDEM_DE_FABRICACAO odf
                        ON odf.id = ser.ORDEM_DE_FABRICACAO_ID
                    INNER JOIN lote_serial ls
                        ON ls.serial_id = ser.id
                    INNER JOIN lote lo
                        ON ls.lote_id = lo.id            
                WHERE odf.ORDEM_DE_PRODUCAO_ID = op.id
                  AND lo.status_lote <> '${StatusLote.ROMANEIO.name()}'
            )
        """
    }

    static String montaSubQueryTotalPecasEmRomaneio(){
        return """
            (
                SELECT COUNT(ser.ID)
                FROM SERIAL_FABRICACAO ser
                    INNER JOIN ORDEM_DE_FABRICACAO odf
                        ON odf.id = ser.ORDEM_DE_FABRICACAO_ID
                    INNER JOIN lote_serial ls
                        ON ls.serial_id = ser.id
                    INNER JOIN lote lo
                        ON ls.lote_id = lo.id            
                WHERE odf.ORDEM_DE_PRODUCAO_ID = op.id
                  AND lo.status_lote = '${StatusLote.ROMANEIO.name()}'
            )
        """
    }


    static String montaSubQueryTotal(List<StatusSerialFabricacao> status){
        String statuses = status.collect({"'${it.name()}'"}).join(", ")
        return """
            (
                SELECT COUNT(ser.ID)
                FROM SERIAL_FABRICACAO ser
                    INNER JOIN ORDEM_DE_FABRICACAO odf
                        ON odf.id = ser.ORDEM_DE_FABRICACAO_ID
                WHERE odf.ORDEM_DE_PRODUCAO_ID = op.id
                  AND ser.STATUS_SERIAL IN ($statuses)
            )
        """
    }

    static String montaSubQueryGrupoLinha(){
        return """
            (
                SELECT GLP.nome
                FROM   grupo_linha_producao GLP
                       INNER JOIN produto_grupo_linha PGL
                               ON PGL.grupo_linha_id = GLP.id
                WHERE  pgl.codigo = op.codigo_produto
                       AND ( pgl.roteiro = op.roteiro
                                  OR ( pgl.roteiro IS NULL
                                       AND op.roteiro IS NULL )
                                  OR ( pgl.roteiro IS NULL
                                       AND NOT EXISTS (
                                SELECT
                                    gp.id
                                FROM
                                         grupo_linha_producao gp
                                    JOIN produto_grupo_linha pl ON pl.grupo_linha_id = gp.id
                                WHERE
                                        pl.roteiro = op.roteiro
                                    AND gp.fornecedor_id = op.fornecedor_id
                                    AND pl.codigo = op.codigo_produto
                            ) ) )
                       AND GLP.fornecedor_id = f.id 
            )
        """
    }

    static String montaWhereGrupoLinha(String valor){
        return """
            AND EXISTS(
                SELECT GLP.nome
                FROM   grupo_linha_producao GLP
                       INNER JOIN produto_grupo_linha PGL
                               ON PGL.grupo_linha_id = GLP.id
                WHERE  pgl.codigo = op.codigo_produto
                       AND Nvl(pgl.roteiro, '00') = Nvl(op.roteiro, '00')
                       AND GLP.fornecedor_id = f.id 
                       AND upper(GLP.nome) like upper('%${valor}%')
            )
        """
    }
}
