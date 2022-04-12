import Alert from "react-s-alert";

export default {
    handleAlert(type, message, errorMessage, time = 5000) {
        let alerta = Alert[type]( message,
            {
                position: 'top-right',
                effect: 'scale',
                timeout: time
            });
        return alerta;
    }
}