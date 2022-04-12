package br.com.furukawa.exceptions

class OracleException extends MensagemException {
    OracleException(String mensagem, Object[] args) {
        super(mensagem, args)
    }
}
