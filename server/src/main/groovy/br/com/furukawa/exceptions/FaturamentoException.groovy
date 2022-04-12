package br.com.furukawa.exceptions

class FaturamentoException extends MensagemException {
    FaturamentoException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}
