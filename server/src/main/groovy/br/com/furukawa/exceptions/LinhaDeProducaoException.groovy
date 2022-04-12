package br.com.furukawa.exceptions

class LinhaDeProducaoException extends MensagemException  {
    LinhaDeProducaoException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}
