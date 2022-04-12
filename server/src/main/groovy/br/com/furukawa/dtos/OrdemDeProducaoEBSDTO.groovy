package br.com.furukawa.dtos

class OrdemDeProducaoEBSDTO {
    String codigoProduto
    Long organizationID
    String roteiro
    String lista
    Long quantidade
    String dataPrevisaoFinalizacao
    String lote
    String contaContabil
    String user
    Long groupID
    Integer statusType
    Long idFornecedor
    Long idSite

    OrdemDeProducaoEBSDTO() {

    }

    String asXML() {
        String xml = "<ordem>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            return "\t<${f.getName()}>${f.get(this) ?: ""}</${f.getName()}>"
        }.join("\n")

        xml += "\n</ordem>"

        return xml
    }
}
