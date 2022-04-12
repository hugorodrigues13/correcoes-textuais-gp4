package br.com.furukawa.exceptions

class MensagemException extends RuntimeException {
    String mensagem
    Object[] args

    MensagemException(String mensagem, Object[] args) {
        super(mensagem)
        this.mensagem = mensagem
        this.args = args
    }
}
