package br.com.furukawa.model

import br.com.furukawa.dtos.LoteQuantidadeDTO
import br.com.furukawa.enums.StatusTransacaoRecebimento

import java.text.SimpleDateFormat

class RecebimentoNF {
    Long interfaceTransactionId
    String ordemDeProducao
    String notaFiscal
    BigDecimal quantidade
    Integer sequenciaOperacao
    StatusTransacaoRecebimento status = StatusTransacaoRecebimento.CRIADA
    String erroExportacao
    Date dataCriacao
    Date dataUltimaAtualizacao
    Boolean isConcluirManualmente = false

    static hasMany = [lotesQuantidades: LoteQuantidadeRecebimento]

    static constraints = {
        erroExportacao nullable: true
        dataCriacao nullable: true
        dataUltimaAtualizacao nullable: true
        notaFiscal nullable: true
        interfaceTransactionId nullable: true
    }

    static mapping = {
        table 'gp40.recebimento_nf'
    }

    List<LoteQuantidadeDTO> getQuantidadeLotes() {
        lotesQuantidades ?  lotesQuantidades.collect {
            new LoteQuantidadeDTO(codigoLote:  it.codigoLote, quantidade: it.quantidade)
        } : OrdemDeProducao.getByCodigo(ordemDeProducao)?.getLotesDaNF(notaFiscal)?.collect {
            new LoteQuantidadeDTO(codigoLote: it.key, quantidade: it.value)
        }
    }

    Integer getTotalLotes() {
        OrdemDeProducao.getByCodigo(ordemDeProducao).getLotesDaNF(notaFiscal)*.getValue().sum() as Integer
    }

    String getDataCriacaoFormatada() {
        return new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(dataCriacao)
    }

    String getDataAtualizacaoFormatada() {
        return new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(dataUltimaAtualizacao)
    }
}
