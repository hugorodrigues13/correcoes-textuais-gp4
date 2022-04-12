package br.com.furukawa.dtos

import br.com.furukawa.enums.StatusIntegracaoRomaneio
import br.com.furukawa.enums.StatusRomaneioNotaFiscal
import br.com.furukawa.model.Romaneio
import org.json.JSONObject

class RomaneioStatusIntegracaoDTO {

    String codigoRomaneio
    Long idRomaneio
    String codigoNFEncomenda
    String codigoNFRetorno
    String mensagemIntegracao
    Integer statusNFEncomenda
    Integer statusNFRetorno
    Integer statusIntegracao

    StatusIntegracaoRomaneio getStatusIntegracaoRomaneio(){
        return StatusIntegracaoRomaneio.getById(statusIntegracao)
    }

    StatusRomaneioNotaFiscal getStatusRomaneioNotaFiscalEncomenda(){
        return statusNFEncomenda ? StatusRomaneioNotaFiscal.getById(statusNFEncomenda) : null
    }

    StatusRomaneioNotaFiscal getStatusRomaneioNotaFiscalRetorno(){
        return statusNFRetorno ? StatusRomaneioNotaFiscal.getById(statusNFRetorno) : null
    }

    boolean nenhumaAlteracaoNasNFs(Romaneio romaneio) {
        return (romaneio.notaFiscalEncomenda?.status == getStatusRomaneioNotaFiscalEncomenda()
                && romaneio.notaFiscalRetorno?.status == getStatusRomaneioNotaFiscalRetorno()
                && romaneio.notaFiscalRetorno?.codigo == getCodigoNFRetorno()
                && romaneio.notaFiscalEncomenda.codigo == getCodigoNFEncomenda())
    }

    boolean isFinalizado() {
        return (getCodigoNFEncomenda() && getCodigoNFRetorno()
                && getStatusRomaneioNotaFiscalEncomenda() == StatusRomaneioNotaFiscal.FINALIZADO
                && getStatusRomaneioNotaFiscalRetorno() == StatusRomaneioNotaFiscal.FINALIZADO)
    }

    boolean hasErroNaIntegracao() {
        return (getStatusRomaneioNotaFiscalRetorno() == StatusRomaneioNotaFiscal.ERRO
                || getStatusRomaneioNotaFiscalEncomenda() == StatusRomaneioNotaFiscal.ERRO
                || getStatusIntegracaoRomaneio()?.isErro())
    }

    RomaneioStatusIntegracaoDTO(JSONObject object) {
        this.codigoRomaneio = object.codigoRomaneio
        this.idRomaneio = object.idRomaneio
        this.codigoNFEncomenda = object.has("codigoNFEncomenda") ? object.codigoNFEncomenda : null
        this.codigoNFRetorno = object.has("codigoNFRetorno") ? object.codigoNFRetorno : null
        this.mensagemIntegracao = object.has("mensagemIntegracao") ? object.mensagemIntegracao : null
        this.statusNFEncomenda = object.has("statusNFEncomenda") ? object.statusNFEncomenda : null
        this.statusNFRetorno = object.has("statusNFRetorno") ? object.statusNFRetorno : null
        this.statusIntegracao = object.has("statusIntegracao") ? object.statusIntegracao : null
    }
}
