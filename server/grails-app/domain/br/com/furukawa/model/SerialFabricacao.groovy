package br.com.furukawa.model

import br.com.furukawa.enums.StatusSerialFabricacao

import java.text.SimpleDateFormat

class SerialFabricacao {
    String codigo
    String codigoOrigem
    String ano
    StatusSerialFabricacao statusSerial

    Date dataInicioApontamento
    Date dataEnvioApoio
    Date dataUltimoApontamento
    Date dataApontamentoMaisRecente
    Date dataSucateamento
    Boolean etiquetaApontamentoImpressa = false

    static belongsTo = [ordemDeFabricacao: OrdemDeFabricacao]
    static constraints = {
        codigoOrigem nullable: true
        dataInicioApontamento nullable: true
        dataApontamentoMaisRecente nullable: true
        dataEnvioApoio nullable: true
        dataUltimoApontamento nullable: true
        dataSucateamento nullable: true
    }

    static transients = ['lote', 'caixaImpressao', 'numeroCaixa']

    static mapping = {
        id generator: 'sequence', params: [sequence: 'serial_fabricacao_seq']
        codigo unique: ['ano']
    }

    static String getProximoCodigoSerial(String numeroAno) {
        String codigo = SerialFabricacao.createCriteria().get {
            eq('ano', numeroAno)
            projections {
                max('codigo')
            }
        }
        int ultimaOrdem = Integer.parseInt((codigo ?: "0"),16)
        return String.format('%6s', Integer.toHexString(ultimaOrdem + 1)).replace(' ', '0').toUpperCase()
    }

    Lote getLote(){
        return Lote.createCriteria().get {
            seriais {
                eq "id", this.id
            }
        }
    }

    boolean isLoteFechado() {
        return getLote()?.isFechado()
    }

    Apontamento getApontamento(){
        return Apontamento.findBySerial(this);
    }

    String getCodigoCompleto() {
        return "${codigo}-${ano}"
    }

    String getCodigoOrigem() {
        return codigoOrigem
    }

    boolean isPendenteApoio() {
        return StatusSerialFabricacao.PENDENTE_APOIO == statusSerial
    }

    boolean isPendenteApontamento() {
        return StatusSerialFabricacao.PENDENTE_APONTAMENTO == statusSerial
    }

    boolean isApontamentoFinalizado() {
        return StatusSerialFabricacao.APONTAMENTO_FINALIZADO == statusSerial
    }

    boolean isApontamentoIniciado() {
        return StatusSerialFabricacao.APONTAMENTO_INICIADO == statusSerial
    }

    boolean isApontamentoPorOP() {
        return ApontamentoOrdemDeFabricacao.countByOrdemDeFabricacao(getOrdemDeFabricacao()) > 0
    }

    ApontamentoOrdemDeFabricacao getApontamentoOF() {
        ApontamentoOrdemDeFabricacao.findByOrdemDeFabricacao(getOrdemDeFabricacao())
    }

    boolean isSucateado() {
        return StatusSerialFabricacao.SUCATEADO == statusSerial
    }

    String getCodigoProduto() {
        return ordemDeFabricacao?.codigoProduto
    }

    String getDescricaoProduto() {
        return ordemDeFabricacao?.descricaoDoProduto
    }

    String getCodigoOrdemDeFabricacao() {
        return ordemDeFabricacao?.getCodigoOrdemDeFabricacao()
    }
    String getCodigoOrdemExterna() {
        return ordemDeFabricacao.getCodigoOrdemDeProducao()
    }

    ImpressaoApontamentoCaixa getCaixaImpressao() {
        return ImpressaoApontamentoCaixa.createCriteria().get {
            seriais {
                eq 'id', this.id
            }
        } as ImpressaoApontamentoCaixa
    }

    String getNumeroCaixa(){
        return getCaixaImpressao()?.numeroCaixa
    }

    Recurso getUltimoRecursoApontado() {
        return apontamento?.getUltimoRecursoApontado()
    }

    HistoricoApontamento getUltimoRegistroHistorico() {
        return apontamento.getUltimoRegistroHistorico()
    }

    String getCodigoLote() {
        return getLote()?.getCodigoLote()
    }

    String getDataPrevisaoFinalizacaoFormatada() {
        new SimpleDateFormat("dd/MM/yyyy").format(getDataPrevisaoFinalizacao())
    }

    String getDataSucateamentoFormatado() {
        new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(getDataSucateamento())
    }

    Date getDataPrevisaoFinalizacao() {
        return getOrdemDeFabricacao().getDataPrevisaoFinalizacao()
    }

    boolean ordemDeProducaoInvalidaNoWip() {
        return getOrdemDeProducao()?.isInvalidaNoWip()
    }

    OrdemDeProducao getOrdemDeProducao() {
        return ordemDeFabricacao.getOrdemDeProducao()
    }

    Boolean isSegregrado(){
        return this.ordemDeFabricacao.segregarLotes
    }

    Fornecedor getFornecedorDaOrganizacao() {
        return ordemDeFabricacao.fornecedor
    }

    GrupoRecurso getProcessoAtual() {
        return apontamento?.processoAtual?.grupoRecurso
    }
}
