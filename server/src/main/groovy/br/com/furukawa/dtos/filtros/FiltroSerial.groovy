package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.dtos.Periodo
import br.com.furukawa.enums.StatusImpressaoEtiqueta
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao

import java.text.SimpleDateFormat

class FiltroSerial extends Filtro{

    String serial
    String codigoProduto
    String codigoOrigem
    String codigoGerado
    String descricaoProduto
    String ordemFabricacao
    String ordemProducao
    String lote
    String caixa
    String linhaProducao
    String grupoLinhaProducao
    List<StatusSerialFabricacao> status
    List<StatusOrdemFabricacao> statusOrdemFabricacao
    List<StatusOrdemDeProducaoWIP> statusWip
    String statusImpressaoEtiqueta
    String statusRomaneio
    List<StatusLote> statusLote
    String codigoRomaneio
    Ordenacao ordenacao
    Paginacao paginacao
    String codigoNF
    Periodo dataFinalizacao
    Periodo ultimoApontamento
    Periodo dataRomaneio
    Boolean completo
    Periodo dataSucateamento
    boolean possuiOrdenacao

    FiltroSerial(Map params) {
        super(params)
        this.lote = params.lote
        this.serial = params.serial
        this.ordemProducao = params.ordemProducao
        this.codigoGerado = params.codigoGerado
        this.ordemFabricacao = params.ordemFabricacao
        this.codigoProduto = params.codigoProduto
        this.caixa = params.caixa
        this.statusImpressaoEtiqueta = params.statusImpressaoEtiqueta
//        this.codigoOrigem = params.codigoOrigem
        this.linhaProducao = params.linhaProducao
        this.grupoLinhaProducao = params.grupoLinhaProducao
        this.statusRomaneio = params.statusRomaneio
        this.codigoRomaneio = params.codigoRomaneio
        this.codigoNF = params.codigoNF
        this.completo = params.boolean("completo")
        this.possuiOrdenacao = params.sort  || params.order
    }

    @Override
    protected customizarProp(String prop, Object valor) {
        switch (prop){
            case "status":
                return valor
                        ? (valor as String).split(";").collect { StatusSerialFabricacao.valueOf(it)}
                        : StatusSerialFabricacao.values()
            case "statusOrdemFabricacao":
                return valor
                        ? (valor as String).split(";").collect { StatusOrdemFabricacao.valueOf(it)}
                        : StatusOrdemFabricacao.values()
            case "statusWip":
                return valor
                        ? (valor as String).split(";").collect { StatusOrdemDeProducaoWIP.valueOf(it)}
                        : StatusOrdemDeProducaoWIP.values()
            case "statusLote":
                return valor
                        ? (valor as String).split(";").collect { StatusLote.valueOf(it)}
                        : StatusLote.values()
            default:
                return valor
        }
    }

    @Override
    String traduzirPropParaColuna(String prop) {
        switch (prop){
            case 'serial':
                return "s.codigo || '-' || s.ano"
            case 'codigoOrigem':
                return "s.codigo_origem"
            case 'codigoProduto':
                return "o.codigo_produto"
            case 'descricaoProduto':
                return "nvl(prod.descricao, op.descricao_produto)"
            case 'ordemFabricacao':
                return "o.numero || '-' || o.ano"
            case 'ordemProducao':
                return "f.PREFIXO_PRODUCAO || '-' || op.NUMERO"
            case 'linhaProducao':
                return "Nvl(ldp, ldp1)"
            case 'grupoLinhaProducao':
                return "grupo"
            case 'status':
                return "s.status_serial"
            case 'statusOrdemFabricacao':
                return "o.status"
            case 'statusLote':
                return """l.status_lote"""
            case 'statusWip':
                return "op.status_wip"
            case 'dataFinalizacao':
                return "op.data_previsao_finalizacao"
            case 'ultimoApontamento':
                return "s.DATA_APONTAMENTO_MAIS_RECENTE"
            case 'dataSucateamento':
                return "s.DATA_SUCATEAMENTO"
            case 'dataRomaneio':
                return """gr.emissao"""
            default:
                return prop
        }
    }

    @Override
    String gerarWhere(){
        String where = super.gerarWhere()

        if(serial){
            String serialList = serial.replace(';','|')
            where += "AND regexp_like(s.codigo || '-' || s.ano, '(${serialList})')"
        }

        if(ordemFabricacao) {
            String ordemFabricacaoList = ordemFabricacao.replace(';','|')
            where += "AND regexp_like(o.numero  || '-' || o.ano, '(${ordemFabricacaoList})')"
        }
        if(ordemProducao) {
            String ordemProducaoList = ordemProducao.replace(';','|')
            where += "AND regexp_like(f.PREFIXO_PRODUCAO || '-' || op.NUMERO, '(${ordemProducaoList})')"
        }
        if(codigoProduto) {
            String codigoProdutoList = codigoProduto.replace(';','|')
            where += "AND regexp_like(o.codigo_produto, '(${codigoProdutoList})')"
        }

        if(lote) {
            List<String> lotes = lote.split(";")
            where += """AND exists (select * from gp40.lote l where l.numero_lote || l.semana || l.ano in ('${lotes.join("', '")}') and l.id in(select lote_id from gp40.lote_serial where serial_id=s.id))"""
        }

        if(statusLote && !statusLote.containsAll(StatusLote.values())) {
            where += """AND L.STATUS_LOTE IN('${statusLote.join("', '")}')"""
        }

        if(caixa) {
            where += """and cx.numero_caixa = '${caixa}'"""
        }

        if(linhaProducao) {
            where  += """and upper(nvl(ldpo.nome, ldp.nome)) like '%${linhaProducao.toUpperCase()}%' """
        }

        if(grupoLinhaProducao) {
            where += """AND upper(gp.nome) like '%${grupoLinhaProducao.toUpperCase()}%'"""
        }

        if(statusRomaneio) {
            List<String> statusList = statusRomaneio.split(";")
            where += """and gr.status in ('${statusList.join("', '")}')"""
        }

        if(codigoRomaneio) {
            List<String> codigosRomaneio = codigoRomaneio.split(";")
            where += """AND gr.numero||'/'||gr.ano in  ('${codigosRomaneio.join("', '")}')"""
        }

        if(codigoNF) {
            List<String> codigosNFs = codigoNF.split(";")
            where += """AND grnf.codigo in('${codigosNFs.join("', '")}') """
        }

        if(codigoGerado) {
            where += """and exists 
                        (
                           select  sfn.codigo||'-'||sfn.ANO AS codigo_gerado
                           from serial_fabricacao sfn
                           where sfn.codigo_origem = s.codigo||'-'||s.ano
                        )
                     """
        }

        if(statusImpressaoEtiqueta){
            List<String> statusImpressaoLista = statusImpressaoEtiqueta.split(';')

            if(!statusImpressaoLista.contains(StatusImpressaoEtiqueta.IMPRESSAO_PENDENTE.name())) {
                where += """AND s.etiqueta_apontamento_impressa=1 """
            } else if(!statusImpressaoLista.contains(StatusImpressaoEtiqueta.ETIQUETA_IMPRESSA.name())) {
                where += """AND s.etiqueta_apontamento_impressa=0  """
            }

        }

        return where
    }

    List<String> getIgnorado(){
        List<String> ignorados = super.getIgnorado()
        ignorados.add("lote")
        ignorados.add("codigoRomaneio")
        ignorados.add("serial")
        ignorados.add("ordemFabricacao")
        ignorados.add("ordemProducao")
        ignorados.add("codigoProduto")
        ignorados.add("codigoGerado")
        ignorados.add("codigoNF")
        ignorados.add("caixa")
        ignorados.add("linhaProducao")
        ignorados.add("statusImpressaoEtiqueta")
        ignorados.add("grupoLinhaProducao")
        ignorados.add("statusRomaneio")
        ignorados.add("completo")
        ignorados.add("statusLote")
        ignorados.add("possuiOrdenacao")
        return ignorados
    }

    @Override
    protected String getSortPadrao() {
        return 'serialCompleto'
    }

    @Override
    String traduzirPropParaOrder(String prop) {
        return traduzirPropParaColuna(prop)
    }

    @Override
    String customizarWhere(String prop, Object valor) {
        switch (prop){
            case 'statusWip':
                String inValor = valor.collect({"'$it'"}).join(", ")
                return " AND (${traduzirPropParaColuna(prop)} IS NULL OR ${traduzirPropParaColuna(prop)} IN ($inValor))\n"
            default:
                return super.customizarWhere(prop, valor)
        }
    }

    @Override
    protected getPeriodoFormato(String prop) {
        switch (prop){
            case 'ultimoApontamento':
            case 'dataRomaneio':
            case 'dataSucateamento':
                return "dd/MM/yyyy HH:mm"
            default:
                return super.getPeriodoFormato(prop)
        }
    }

    @Override
    String gerarOrderBy(){
        Ordenacao ordenacao = this.ordenacao
        if(this.possuiOrdenacao)
            return "ORDER BY ${traduzirPropParaOrder((ordenacao.sort))} ${ordenacao.order} nulls last"
        else return ""
    }
}
