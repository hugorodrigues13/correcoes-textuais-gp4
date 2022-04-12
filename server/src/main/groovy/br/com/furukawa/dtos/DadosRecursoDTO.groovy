package br.com.furukawa.dtos

import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Conector
import br.com.furukawa.model.Defeito

class DadosRecursoDTO {
    String nome
    String metaOEE
    String codigoOracle
    Fornecedor fornecedor
    List<Conector> conectores
    List<Defeito> defeitos

    DadosRecursoDTO(String nome, String metaOEE, String codigoOracle, Fornecedor fornecedor, List<Conector> conectores, List<Defeito> defeitos) {
        this.nome = nome
        this.metaOEE = metaOEE
        this.codigoOracle = codigoOracle
        this.fornecedor = fornecedor
        this.conectores = conectores
        this.defeitos = defeitos
    }
}
