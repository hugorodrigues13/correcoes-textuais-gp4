package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class Fornecedor extends Audit implements Serializable {
    private static final long serialVersionUID = 1

    Long organizationId
    String nome
    Long vendorId
    String prefixoProducao
    String endereco

    static constraints = {
        prefixoProducao nullable: true, unique: true, size: 3..3
        endereco nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'fornecedor_seq']
    }

    Organizacao getOrganizacaoDoFornecedor() {
        return Organizacao.findByOrganizationID(organizationId.toString())
    }

    static Fornecedor getFurukawaEletricLatamSa(Long organizationId){
        return findByOrganizationIdAndVendorId(organizationId, 5142L)
    }

    boolean isFurukawaEletricLatamSa(){
        return this.vendorId == 5142L
    }

}