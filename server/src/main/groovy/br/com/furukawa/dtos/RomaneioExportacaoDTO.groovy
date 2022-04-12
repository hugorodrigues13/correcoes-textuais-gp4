package br.com.furukawa.dtos

class RomaneioExportacaoDTO {
    Long organizationIdExecutor
    Long organizationIdSolicitante
    String codigoRomaneio
    Long idRomaneio
    BigDecimal quantidadeVolume

    List<RomaneioExportacaoLinhaDTO> linhas

    RomaneioExportacaoDTO() {
        linhas = new ArrayList<>()
    }

    String asXML() {
        String xml = "<romaneio>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            if (f.getName() == "linhas") {
                return "\t" + f.get(this).collect {
                    "${it.asXML()?.replace("\n", "\n\t")}"
                }.join("\n\t")
            } else {
                return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
            }
        }.join("\n")

        xml += "\n</romaneio>"

        return xml
    }
}
