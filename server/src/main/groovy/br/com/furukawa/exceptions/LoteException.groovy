package br.com.furukawa.exceptions

class LoteException extends MensagemException {
    LoteException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}