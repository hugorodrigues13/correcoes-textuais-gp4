package br.com.furukawa.dtos.asaichi

import br.com.furukawa.dtos.ProducaoMensalDTO
import br.com.furukawa.dtos.filtros.FiltroAsaichi
import groovy.json.JsonSlurper

class ApontamentoMensal {
    Integer multiplicador
    String codigoProduto
    String grupoLinha
    String dados

    List<ProducaoMensalDTO> getDadosFormatados(){
        List<ProducaoMensalDTO> producaoRetorno = new ArrayList<>()
        List<AsaichiProducaoDefeitosMensal> dadosJson = new JsonSlurper().parseText(dados) as ArrayList<AsaichiProducaoDefeitosMensal>
        dadosJson.groupBy {it.dia.substring(3)}.each {
            producaoRetorno.add(new ProducaoMensalDTO(
                    mes: it.key,
                    produzido: it.value*.produzido.sum(),
                    conectores: it.value*.produzido.sum() * multiplicador,
                    codigoProduto: codigoProduto,
                    grupoLinha: grupoLinha
            ))
        }

        return producaoRetorno
    }

    List<AsaichiProducaoDefeitosMensal> getDadosFormatados(FiltroAsaichi filtro) {
        List<AsaichiProducaoDefeitosMensal> dadosJson = new JsonSlurper().parseText(dados) as ArrayList<AsaichiProducaoDefeitosMensal>

        if(filtro.isConector()) {
            dadosJson.each {
                it.produzido *= multiplicador
                it.defeitos *= multiplicador
            }
        }

        return dadosJson
    }
}
