package br.com.furukawa.model

import br.com.furukawa.enums.TipoApontamentoMaterial
import br.com.furukawa.utils.Audit

import java.text.SimpleDateFormat

class ApontamentoDeMaterial extends Audit {
    String codigoProduto
    String codigoLote
    BigDecimal quantidade
    String ordemDeProducao
    TipoApontamentoMaterial tipo
    String erroExportacao

    Fornecedor fornecedor

    static constraints = {
        erroExportacao nullable: true
    }

    static mapping = {
        table 'gp40.apontamento_de_material'
        id generator: 'sequence', params: [sequence: 'gp40.apontamento_de_material_seq']
    }

    String dataCriacaoFormadata() {
        new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(dataCriacao)
    }
}
