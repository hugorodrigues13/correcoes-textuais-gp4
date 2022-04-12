package br.com.furukawa.exceptions

class ServicosException extends MensagemException {
    int httpStatus

    ServicosException(String mensagem, Object[] args, int status=200) {
        super(mensagem, args)
        this.httpStatus = status
    }
}
