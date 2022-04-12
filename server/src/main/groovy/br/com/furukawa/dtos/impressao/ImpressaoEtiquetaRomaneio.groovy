package br.com.furukawa.dtos.impressao

import br.com.furukawa.model.Romaneio
import org.json.JSONObject

import java.text.SimpleDateFormat

class ImpressaoEtiquetaRomaneio {
    String identificador
    String romaneio
    String dataEmissao
    String horaEmissao
    String dataEntrega
    String condPg
    String cliente
    String endereco
    String nomeFornecedor
    String enderecoFornecedor
    String bairro
    String cidade
    String uf
    String cep
    String cfpOuCnpj
    String ieOuRg
    String entrega
    String valorTotal
    String volumeTotal
    String quantidadeTotal
    String quantidadeItens
    String lotes
    List<LinhasImpressaoRomaneio> linhas

    ImpressaoEtiquetaRomaneio(String codigoEtiqueta,
                              Romaneio romaneio) {
        SimpleDateFormat SDF_DIA = new SimpleDateFormat("dd/MM/yyyy")
        SimpleDateFormat SDF_HORA = new SimpleDateFormat("hh:mm")

        this.identificador = codigoEtiqueta
        this.romaneio = romaneio.getCodigoRomaneio()
        this.dataEmissao = SDF_DIA.format(romaneio.getEmissao())
        this.horaEmissao = SDF_HORA.format(romaneio.getEmissao())
        this.dataEntrega = SDF_DIA.format(romaneio.getEmissao())
        this.condPg = romaneio.getCondPg()
        this.cliente = romaneio.getCliente()
        this.endereco = romaneio.getEndereco()
        this.nomeFornecedor = romaneio.getFornecedor().getNome()
        this.enderecoFornecedor = romaneio.getFornecedor().getEndereco()
        this.bairro = romaneio.getBairro()
        this.cidade = romaneio.getCidade()
        this.uf = romaneio.getUf()
        this.cep = romaneio.getCep()
        this.cfpOuCnpj = romaneio.getCpfOuCnpj()
        this.ieOuRg = romaneio.getIeOuRg()
        this.entrega = romaneio.getEntrega()
        this.valorTotal = romaneio.getServicos().sum{ it.getValorTotal() }
        this.volumeTotal = romaneio.getVolumeEditadoOuTotalDosServicos()
        this.quantidadeTotal = romaneio.getServicos().sum{ it.getQuantidade() }
        this.quantidadeItens = romaneio.getServicos()*.getProdutos().flatten().size()
        this.lotes = romaneio.getLotesString()
        this.linhas = new ArrayList<>()

        romaneio.getServicosOrdenados()?.each {servico ->
            this.linhas.add(new LinhasImpressaoRomaneio(servico))
            servico.produtos?.sort {it.ordemDeProducao?.numero}?.each {produto ->
                this.linhas.add(new LinhasImpressaoRomaneio(produto))
            }
        }
    }

    JSONObject toJsonObject() {
        return new JSONObject(
                "identificador": identificador,
                "ROMANEIO": romaneio,
                "EMISSAO_DATA": dataEmissao,
                "EMISSAO_HORA": horaEmissao,
                "ENTREGAR_EM": dataEntrega,
                "COND_PG": condPg,
                "CLIENTE": cliente,
                "ENDERECO": endereco,
                "NOME_FORNECEDOR": nomeFornecedor,
                "ENDERECO_FORNECEDOR": enderecoFornecedor,
                "BAIRRO": bairro,
                "CIDADE": cidade,
                "UF": uf,
                "CEP": cep,
                "CPF_CNPJ": cfpOuCnpj,
                "IE_RG": ieOuRg,
                "ENTREGA": entrega,
                "SOMA_VALOR_TOTAL": valorTotal,
                "VOLUME_TOTAL": volumeTotal,
                "QTDE_TOTAL": quantidadeTotal,
                "QTDE_ITENS": quantidadeItens,
                "LOTES": lotes,
                "linhas": linhas.collect {it.toJSONObject()}
        )
    }

    String getJsonStringEtiqueta() {
        return this.toJsonObject().toString()
    }
}
