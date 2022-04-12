package br.com.furukawa.exceptions

class ApontamentoException extends MensagemException {

    final static String OUTROS = "#DD0000"
    final static String NAO_APONTADO_PRIMEIRO = "#0704B5"
    final static String JA_APONTADO_ULTIMO = "#7D3865"

    String cor

    ApontamentoException(String mensagem, Object[] args, String cor=OUTROS) {
        super(mensagem, args)
        this.cor = cor
    }
}
