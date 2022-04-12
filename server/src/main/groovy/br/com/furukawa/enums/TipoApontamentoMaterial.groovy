package br.com.furukawa.enums

enum TipoApontamentoMaterial {
    CONSUMO(35),
    RETORNO(43)

    int idOracle

    private TipoApontamentoMaterial(int idOracle) {
        this.idOracle = idOracle
    }

    boolean isConsumo() {
        equals(CONSUMO)
    }
}
