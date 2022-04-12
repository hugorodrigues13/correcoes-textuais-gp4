package br.com.furukawa.service

import br.com.furukawa.enums.StatusLote
import br.com.furukawa.exceptions.TransformacaoLoteException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Lote
import br.com.furukawa.model.SerialFabricacao
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery

@Transactional
class TransformacaoLoteService {

    SessionFactory sessionFactory
    LogOperacaoService logOperacaoService
    LoteService loteService

    Lote dividirLote(Lote loteAntigo, List<ImpressaoApontamentoCaixa> novoLoteCaixas){
        Lote novoLote = loteService.clonarLote(loteAntigo)

        List<SerialFabricacao> seriais = novoLoteCaixas*.seriais.flatten()
        novoLote.setSeriais(seriais as Set)
        seriais.each {loteAntigo.removeFromSeriais(it)}

        ImpressaoApontamentoLote impressaoNova = loteAntigo.impressao.clone()
        impressaoNova.lote = novoLote
        novoLoteCaixas.each {
            it.impressaoLote = impressaoNova
        }

        loteAntigo.quantidade -= seriais.size()
        novoLote.quantidade = seriais.size()
        impressaoNova.save(flush: true, failOnError: true)
        loteAntigo.save(flush: true, failOnError: true)
        novoLote.save(flush: true, failOnError: true)

        logOperacaoService.dividirLotes(loteAntigo, novoLote)

        return novoLote
    }

    void agruparLote(Lote lote1, Lote lote2, boolean manterLote1){
        if (!lote1 || !lote2){
            throw new TransformacaoLoteException("default.not.found.message")
        }
        if (lote1 == lote2){
            throw new TransformacaoLoteException("transformacaoLotes.agrupar.mesma.message")
        }
        Set<SerialFabricacao> seriais = manterLote1 ? lote2.seriais : lote1.seriais
        Set<ImpressaoApontamentoCaixa> caixas = manterLote1 ? lote2.impressao.caixas : lote1.impressao.caixas
        ImpressaoApontamentoLote impressao = manterLote1 ? lote1.impressao : lote2.impressao

        seriais.each {
            if (manterLote1){
                lote1.addToSeriais(it)
            } else {
                lote2.addToSeriais(it)
            }
        }

        caixas.each {caixa ->
            ImpressaoApontamentoCaixa outraCaixa = impressao.getCaixa(caixa.numeroCaixa)
            if (!outraCaixa){
                outraCaixa = impressao.criarNovaCaixa(caixa.numeroCaixa)
            }
            caixa.seriais.each {outraCaixa.addToSeriais(it)}
        }

        if (manterLote1){
            lote1.quantidade += seriais.size()
            lote2.impressao.delete(flush: true, failOnError: true)
            lote2.delete(flush: true, failOnError: true)
        } else {
            lote2.quantidade += seriais.size()
            lote1.impressao.delete(flush: true, failOnError: true)
            lote1.delete(flush: true, failOnError: true)
        }

        logOperacaoService.agruparLotes(lote1, lote2)
    }

    List<String> getLotes(Fornecedor fornecedor, String numeroLote){
        String sql = """
            SELECT DISTINCT l.NUMERO_LOTE || l.semana || l.ANO
            FROM gp40.LOTE l
                left JOIN gp40.grupo_LINHA_PRODUCAO gldp
                    ON gldp.id = l.grupo_linha_de_producao_id
                JOIN gp40.IMPR_APONT_LOTE cx
                    ON cx.LOTE_ID = l.id
            WHERE gldp.fornecedor_id = '${fornecedor.id}'
            ${numeroLote ? "AND UPPER(l.NUMERO_LOTE || l.semana || l.ANO) LIKE UPPER('%${numeroLote}%')" : ""}
            AND l.status_lote = '${StatusLote.FECHADO}'
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setMaxResults(10)
        return query.list()
    }

}
