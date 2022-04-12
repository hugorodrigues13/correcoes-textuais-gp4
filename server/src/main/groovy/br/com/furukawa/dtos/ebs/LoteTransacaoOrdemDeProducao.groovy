package br.com.furukawa.dtos.ebs

class LoteTransacaoOrdemDeProducao {
    String numeroLote
    BigDecimal quantidadeUtilizada

    String asXML() {
        String xml = "<lotes>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
        }.join("\n")

        xml += "\n</lotes>"

        return xml
    }
}
