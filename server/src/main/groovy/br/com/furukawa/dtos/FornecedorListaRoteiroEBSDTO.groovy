package br.com.furukawa.dtos

import org.json.JSONObject

class FornecedorListaRoteiroEBSDTO {
    String nomeFornecedor
    Long idFornecedor
    String lista
    String roteiro
    Long organizationID
    String codigoProduto
    String detalhesRoteiro
    String detalhesLista
    Long idSite

    FornecedorListaRoteiroEBSDTO(JSONObject object) {
        if(object) {
            this.nomeFornecedor = object.has("nomeFornecedor") ? object.nomeFornecedor : null
            this.idFornecedor =  object.has("idFornecedor") ? object.idFornecedor : null
            this.organizationID = object.has("organizationID") ? object.organizationID : null
            this.codigoProduto = object.has("codigoProduto") ? object.codigoProduto : null
            this.detalhesRoteiro = object.has("detalhesRoteiro") ? object.detalhesRoteiro : null
            this.detalhesLista = object.has("detalhesLista") ? object.detalhesLista : null
            if(object.has("lista")) {
                this.lista = object.lista
            }
            if(object.has("roteiro")) {
                this.roteiro = object.roteiro
            }

            if(object.has("idSite")) {
                this.idSite = object.idSite
            }
        }
    }
}
