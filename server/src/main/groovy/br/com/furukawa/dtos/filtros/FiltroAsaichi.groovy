package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Periodo
import br.com.furukawa.enums.TipoBuscaAsaichi
import groovy.transform.ToString

import java.text.SimpleDateFormat

class FiltroAsaichi extends Filtro{

    static SimpleDateFormat SDF() { new SimpleDateFormat("dd/MM/yyyy") }

    String linhaProducao
    String conector
    Date data
    Long idFornecedor
    TipoBuscaAsaichi tipo

    FiltroAsaichi(Map params) {
        super(params)
    }

    @Override
    protected Object customizarProp(String prop, Object valor) {
        if (prop == 'data'){
            return valor ? FiltroAsaichi.SDF().parse(valor) : new Date()
        } else if(prop == 'tipo') {
            return TipoBuscaAsaichi.valueOf(valor ?: "PECA")
        }
        return super.customizarProp(prop, valor)
    }


    boolean isConector() {
        tipo.isConector()
    }

    boolean filtroDataDeHoje() {
        return FiltroAsaichi.SDF().format(new Date()) == FiltroAsaichi.SDF().format(data)
    }
}
