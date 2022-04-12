import Alert from "react-s-alert";

export default {
    handleAlert(type, message, tirarAlertaDeErroDaLista, errorMessage, time = 5000) {
        let alerta = Alert[type]( message,
            {
                position: 'top-right',
                effect: 'scale',
                timeout: time,
                onClose: function() {
                    //tirarAlertaDeErroDaLista deve ser testado para null e undefined, logo deve-se manter
                    //o sinal != ao invés de !==
                    if (type === "error" && tirarAlertaDeErroDaLista != null) {
                        tirarAlertaDeErroDaLista(errorMessage);
                    }
                }
            });
        return alerta;
    }
}