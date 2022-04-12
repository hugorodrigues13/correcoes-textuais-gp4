package br.com.furukawa.exceptions

class ImpressoraException extends MensagemException  {
    ImpressoraException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}
