package br.com.furukawa.model

import br.com.furukawa.enums.StatusIntegracaoRomaneio
import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.utils.Audit

import java.math.RoundingMode
import java.text.SimpleDateFormat

class Romaneio extends Audit {

    private static final SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy '|' hh:mm")

    String numero
    String ano
    Date emissao
    RomaneioNotaFiscal notaFiscalEncomenda
    RomaneioNotaFiscal notaFiscalRetorno
    Integer volume
    StatusRomaneio status
    String mensagemIntegracao

    static hasMany = [lotes: Lote, servicos: ServicoRomaneio, historico: HistoricoRomaneio]
    static belongsTo = [fornecedor: Fornecedor]

    static constraints = {
        emissao nullable: true
        numero unique: 'ano'
        notaFiscalEncomenda nullable: true
        notaFiscalRetorno nullable: true
        volume nullable: true
        servicos cascade: "all-delete-orphan"
        mensagemIntegracao nullable: true
    }

    static mapping = {
        table 'romaneio'
        id generator: 'sequence', params: [sequence: 'romaneio_seq']
        lotes joinTable: [name: 'lote_romaneio', key: 'romaneio_id', column: 'lote_id']
    }

    String getDataEmissaoFormatada() {
        return SDF.format(emissao)
    }

    String getCodigoRomaneio() {
        return "${numero}/${ano}"
    }

    Long getQuantidadeTotal() {
        return servicos.sum { it?.quantidade } as Long
    }

    BigDecimal getValorTotal() {
        return servicos.sum { it?.valorTotal } as BigDecimal
    }

    static String getProximoNumeroRomaneio(String numeroAno) {
        String codigo = Romaneio.createCriteria().get {
            eq('ano', numeroAno)
            projections {
                max('numero')
            }
        }
        int ultimoNumero = Integer.parseInt(codigo ?: '0', 10)
        return String.format("%07d", ultimoNumero + 1)
    }

    Organizacao getOrganizacaoRomaneio() {
        return fornecedor.getOrganizacaoDoFornecedor()
    }

    Integer getVolumeEditadoOuTotalDosServicos() {
        return volume ?: servicos?.sum { it?.getVolume() } as Integer
    }

    boolean podeSerCancelado() {
        return isAberto() || notasCanceladas()
    }

    boolean isAberto() {
        return status.isAberto()
    }

    boolean notasCanceladas() {
        return (notaFiscalRetorno?.status || notaFiscalRetorno?.isCancelada()) && (!notaFiscalEncomenda?.status || notaFiscalEncomenda?.isCancelada())
    }

    String getCondPg() {
        return "35 dd"
    }

    String getCliente() {
        return "Furukawa Electric LatAm S.A"
    }

    String getEndereco() {
        return "RUA HASDRUSBAL BELLEGARD, 820"
    }

    String getBairro() {
        return "CIC"
    }

    String getCidade() {
        return "Curitiba"
    }

    String getUf() {
        return "PR"
    }

    String getCep() {
        return "81460-120"
    }

    String getCpfOuCnpj() {
        return "51.775.690/0001-91"
    }

    String getIeOuRg() {
        return "1013620004"
    }

    String getEntrega() {
        return "RUA HASDRUSBAL BELLEGARD, 820"
    }

    String getLotesString() {
        try {
            return lotes.collect {"${it.getCodigoLote()} (${it.quantidade})" }.join(", ")
        } catch (Exception e) {
            println e
            return ""
        }
    }

    Map<String, BigDecimal> getQuantidadesPorLotesDaOrdemDeProducao(String codigoOP) {
        return lotes.collectEntries {lote ->
            return [lote.getCodigoLote(), lote.getQuantidadePorOP(codigoOP)]
        }.findAll {it.value}
    }

    List<ServicoRomaneio> getServicosOrdenados() {
        return servicos.sort {a, b ->
            a.codigo <=> b.codigo ?: a.lote?.codigoLote <=> b.lote?.codigoLote ?: a.valorUnitario <=> b.valorUnitario
        }
    }
}