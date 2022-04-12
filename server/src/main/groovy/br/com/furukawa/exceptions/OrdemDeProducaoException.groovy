package br.com.furukawa.exceptions

class OrdemDeProducaoException extends MensagemException {

    boolean warning
    OrdemDeProducaoException(String mensagem, Object[] args) {
        super(mensagem, args)
    }

    OrdemDeProducaoException(String mensagem, Object[] args, boolean warning) {
        super(mensagem, args)
        this.warning = warning
    }
}
