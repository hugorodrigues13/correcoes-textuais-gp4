import Alerta from "../components/Alerta";

export default {
    handleAlert(context, error, isShowAlert) {
        if(error  && error.response && error.response.status === 422) {
            let state = context.state;
            state.errors = [];
            error.response.data.errors.forEach(erro => {
                let message = context.getMessage(erro.message);
                if(isShowAlert) {
                    Alerta.handleAlert("error", message);
                }
                state.errors.push({
                    message: message,
                    field: erro.field
                })
            });
            context.setState(state);
        }else{
            let message = context.getMessage("comum.erroDesconhecido.mensagem") + error;
            Alerta.handleAlert("error", message);
        }
    }
}