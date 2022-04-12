package br.com.furukawa.exceptions

class TransformacaoLoteException extends MensagemException {

    TransformacaoLoteException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}
