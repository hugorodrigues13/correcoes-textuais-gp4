package br.com.furukawa.dtos

import groovy.transform.ToString

@ToString
class OrdenacaoDTO {

    String tipo
    String selecao
    Integer prioridade

    String traduzirTipoParaColuna(){
        switch (this.tipo){
            case 'ordemFabricacao':
                return "gof.numero || '-' || gof.ano"
            case 'dataPrometida':
                return "gop.data_previsao_finalizacao"
            case 'codigoProduto':
                return "gof.codigo_produto"
            case 'cliente':
                return "client.valor"
            case 'comprimento':
                return "to_number(replace(comp.valor, '.', ','))"
            default:
                return ""
        }
    }

}
