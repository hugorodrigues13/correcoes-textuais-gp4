package br.com.furukawa.model

import br.com.furukawa.enums.TipoDeDado
import br.com.furukawa.utils.Audit

class ConfiguracaoGeral extends Audit {

    String descricao
    String valor
    TipoDeDado tipoDeDado

    Organizacao organizacao

    static mapping = {
        id generator: 'sequence', params: [sequence: 'configuracao_geral_seq']
    }

    static String getCaminhoEBS() {
        return findByDescricao("Caminho EBS").valor
    }

    static boolean isImpressaoLigada() {
        return findByDescricao("Impressão Ligada").valor == "SIM"
    }

    static Integer getLimiteSeparacaoEmHoras() {
        return Integer.parseInt(findByDescricao("Limite para separacao em horas").valor)
    }

    static String getIdentificadorDaEtiquetaSeriaisDaOrdemFabricacao() {
        return findByDescricao("Identificador da Etiqueta dos Seriais da Ordem de Fabricação").valor
    }

    static String getUrlImprimirEtiqueta() {
        return findByDescricao("URL Imprimir Etiqueta").valor
    }

    static String getBaseUrlImpressoras() {
        return findByDescricao("Base URL Impressoras").valor
    }

    static String getUrlBaseRTDA() {
        return findByDescricao("URL RTDA").valor
    }

    static String getUrlGerarPdfImpressora() {
        return findByDescricao("URL Gerar PDF Etiqueta").valor
    }

    static String getIdentificadorDaEtiquetaRomaneio() {
        return findByDescricao("Identificador da Etiqueta do Romaneio").valor
    }

    static String getIdentificadorDaEtiquetaFolhaImpressao(){
        return findByDescricao("Identificador da Etiqueta da Folha de Impressão").valor
    }

    static List<String> getTiposDeConectores() {
        return findByDescricao("Tipos de Conectores")?.valor?.split(", ")
    }

    static String getDataLiberacaoAutenticacaoServicosSTF() {
        return findByDescricao("Data Liberação Autenticação Servicos STF").valor
    }
}
