package br.com.furukawa.dtos.impressao

import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.SerialFabricacao
import org.json.JSONObject

import java.text.SimpleDateFormat

class ImpressaoEtiquetaApontamento {
    String identificador
    List<LinhasImpressaoApontamento> linhas
    String codigoProduto
    String ordemExterna
    String ordemInterna
    String data
    String dia
    String hora
    String lote
    int quantidade
    int copias
    String numeroCaixaIdentificador

    ImpressaoEtiquetaApontamento(String codigoEtiqueta,
                                 Set<SerialFabricacao> seriais,
                                 String codigoProduto,
                                 OrdemDeProducao ordemDeProducao,
                                 OrdemDeFabricacao ordemDeFabricacao,
                                 Date data,
                                 int quantidade,
                                 int copias,
                                 String numeroCaixaIdentificador) {
        this.data = new SimpleDateFormat("MM/yyyy").format(data)
        this.dia = new SimpleDateFormat("dd").format(data)
        this.hora = new SimpleDateFormat("hh:mm").format(data)
        this.identificador = codigoEtiqueta
        this.codigoProduto = codigoProduto
        this.ordemExterna = ordemDeProducao.getCodigoOrdem()
        this.ordemInterna = ordemDeFabricacao.getCodigoOrdemDeFabricacao()
        this.quantidade = quantidade
        this.copias = copias
        this.lote = seriais.first().getCodigoLote() ?: "0"
        this.numeroCaixaIdentificador = numeroCaixaIdentificador

        this.linhas = seriais.collect {new LinhasImpressaoApontamento(it)}
    }

    JSONObject toJsonObject() {
        return new JSONObject(
                "identificador": identificador,
                "codigo_lote": codigoProduto,
                "linhas": linhas.collect {it.toJSONObject()},
                "codigo_produto": codigoProduto,
                "ORDEM_EXTERNA": ordemExterna,
                "ORDEM_INTERNA": ordemInterna,
                "DATA": data,
                "DIA": dia,
                "HORA": hora,
                "QUANTIDADE": quantidade,
                "total_copias": copias,
                "LOTE": lote,
                "caixa": numeroCaixaIdentificador
        )
    }

    String getJsonStringEtiqueta() {
        return this.toJsonObject().toString()
    }
}
