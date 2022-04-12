package br.com.furukawa.dtos.impressao

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.ItemCatalogoDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.Romaneio
import org.json.JSONObject

import java.text.SimpleDateFormat

class ImpressaoEtiquetaFolhaImpressao {

    String identificador
    String lote
    String dataAtual
    String impressoPor
    Long quantidadeLote
    String modelo
    String codigo
    String descricao
    String observacao
    String listaAlternativa
    String roteiroAlternativo
    String dataPrometida
    String ordemDeProducao
    String grupoLinhaProducao
    String linhaProducao
    List<ImpressaoEtiquetaFolhaImpressaoMP> linhas

    ImpressaoEtiquetaFolhaImpressao(String codigoEtiqueta, String usuario,
                                    OrdemDeFabricacao of, List<ItemCatalogoDTO> catalogos, List<ComponenteWIP> mps) {
        SimpleDateFormat SDF_DIA = new SimpleDateFormat("dd/MM/yyyy")
        SimpleDateFormat SDF_HORA = new SimpleDateFormat("hh:mm")
        ItemCatalogoDTO modelo = catalogos.find({it.nome == ItensCatalogoFixos.MODELO})

        this.identificador = codigoEtiqueta
        this.lote = of.getCodigoOrdemDeFabricacao()
        this.dataAtual = SDF_DIA.format(new Date())
        this.impressoPor = usuario
        this.quantidadeLote = of.quantidadeTotal
        this.modelo = modelo?.valor ?: ""
        this.codigo = of.codigoProduto
        this.descricao = of.descricaoDoProduto
        this.observacao = of.comentarios ?: ""
        this.listaAlternativa = of.ordemDeProducao.lista ?: "00"
        this.roteiroAlternativo = of.ordemDeProducao.roteiro ?: "00"
        this.dataPrometida = SDF_DIA.format(of.ordemDeProducao.dataPrevisaoFinalizacao)
        this.grupoLinhaProducao = of.grupoLinhaProducao?.nome
        this.linhaProducao = of.linhaDeProducao?.nome
        this.ordemDeProducao = of.getCodigoOrdemDeProducao()
        this.linhas = mps.collect({new ImpressaoEtiquetaFolhaImpressaoMP(it, of)})
    }

    JSONObject toJsonObject() {
        return new JSONObject(
                "identificador": identificador,
                "LOTE": lote,
                "DATA_IMPRESSAO": dataAtual,
                "IMPRESSO_POR": impressoPor,
                "QTDE_LOTE": quantidadeLote,
                "MODELO": modelo,
                "CODIGO_PRODUTO": codigo,
                "DESCRICAO_PRODUTO": descricao,
                "OBSERVACAO": observacao,
                "LISTA_ALTERNATIVA": listaAlternativa,
                "ROTEIRO_ALTERNATIVA": roteiroAlternativo,
                "DATA_PREVISTA": dataPrometida,
                "GRUPO_LINHAS": grupoLinhaProducao,
                "LINHA_DE_PRODUCAO": linhaProducao,
                "ORDEM_PRODUCAO": ordemDeProducao,
                "linhas": linhas.collect({it.toJsonObject()})
        )
    }

    String getJsonStringEtiqueta() {
        return this.toJsonObject().toString()
    }
}
