package br.com.furukawa.dtos

class DadosGraficoSeriaisApontadosUltimas24HorasDTO {
    List<HoraApontamentoGraficoDTO> dadosPorHora

    DadosGraficoSeriaisApontadosUltimas24HorasDTO() {
        dadosPorHora = new ArrayList<HoraApontamentoGraficoDTO>()
    }
}