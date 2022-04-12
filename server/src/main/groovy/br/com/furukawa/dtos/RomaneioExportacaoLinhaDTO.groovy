package br.com.furukawa.dtos

class RomaneioExportacaoLinhaDTO {
    Long idLinhaGP
    Long inventoryItemId
    BigDecimal quantidade
    BigDecimal precoUnitario
    String ordemDeProducao
    String pedido
    String release
    String linha
    String descricao

    String asXML() {
        String xml = "<linhas>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
        }.join("\n")

        xml += "\n</linhas>"

        return xml
    }
}
