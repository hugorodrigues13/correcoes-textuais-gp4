package br.com.furukawa.dtos.filtros

import java.text.DateFormat
import java.text.SimpleDateFormat

class FiltroRelatorioSerial extends FiltroSerial {
    Boolean completo

    FiltroRelatorioSerial(Map params) {
        super(params)
        this.completo = params.boolean("completo")
    }

    List<String> getIgnorado(){
        List<String> ignorados = super.getIgnorado()
        ignorados.add("completo")
        return ignorados
    }

    @Override
    protected String getSortPadrao() {
        return 'serialCompleto'
    }

    @Override
    String gerarWhere(){
        String where = " "

        if(lote) {
            where += """AND EXISTS
                        ( SELECT     l.numero_lote
                                                 ||l.semana
                                                 ||l.ano
                           FROM       GP40.lote l
                           INNER JOIN GP40.lote_serial ls
                           ON         ls.lote_id=l.id
                           AND        ls.serial_id=s.id
                           AND        l.numero_lote || l.semana || l.ano in ('${lote.split(";").join("', '")}')) """
        }

        if(linhaProducao) {
            where  += """AND EXISTS(
                            (
                                       SELECT     lp.nome
                                       FROM       GP40.linha_de_producao lp
                                       INNER JOIN GP40.apontamento apo
                                       ON         apo.linha_de_producao_id=lp.id
                                       WHERE      apo.serial_id=s.id
                                       AND        lp.nome in ('${linhaProducao.split(";").join("', '")}'))
                            UNION
                                  (
                                         SELECT nome
                                         FROM   GP40.linha_de_producao
                                         WHERE  id=o.linha_de_producao_id
                                         AND    nome in ('${linhaProducao.split(";").join("', '")}')))"""
        }

        if(grupoLinhaProducao) {
            where += """AND upper(gp.nome) in upper('${grupoLinhaProducao.split(";").join("', '")}')"""
        }

        if(codigoProduto) {
            where += " AND ( o.codigo_produto in ('${codigoProduto.split(";").join("', '")}') )\n"
        }

        if(statusOrdemFabricacao) {
            where += " AND o.status in('${statusOrdemFabricacao.join("', '")}')\n"
        }

        if(dataFinalizacao.dataInicial && dataFinalizacao.dataFinal) {
            DateFormat df = new SimpleDateFormat(dataFinalizacao.padrao)
            where += """ AND hist.data BETWEEN
                        to_date('${df.format(dataFinalizacao.dataInicial)}', 'DD/MM/YYYY HH24') AND
                        to_date('${df.format(dataFinalizacao.dataFinal)}', 'DD/MM/YYYY HH24')"""
        }

        if(ordemFabricacao) {
            where += "AND ( o.numero || '-' || o.ano in ('${ordemFabricacao.split(";").join("', '")}') )\n"
        }

        if(ordemProducao) {
            where += "AND ( f.PREFIXO_PRODUCAO || '-' || op.NUMERO in ('${ordemProducao.split(";").join("', '")}') )\n"
        }

        return where
    }

    @Override
    protected getPeriodoFormato(String prop) {
        switch (prop){
            case 'data':
            case 'dataRomaneio':
                return "dd/MM/yyyy HH:mm"
            case 'dataFinalizacao':
                return 'dd/MM/yyyy HH'
            default:
                return super.getPeriodoFormato(prop)
        }
    }
}
