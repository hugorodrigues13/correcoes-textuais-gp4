import Alerta from "../../components/Alerta";

let showAlerta = null;

export function errorHandler(
  props,
  getMessage,
  errorStatus,
  errorType,
  errorMessage,
  substituiTratamentoDo422,
  executaNoTratamentoDo422,
  checarAlertaRepetido,
  tirarAlertaDaLista,
  inserirMensagemNaLista,
  errorList = null
) {
  let alert;
  let hasAlertasRepetidos = checarAlertaRepetido(errorMessage);

  switch (errorStatus) {
    case 401:
      props.reconhecerSessaoExpirou();
      break;
    case 500:
      if (!hasAlertasRepetidos) {
        alert = Alerta.handleAlert(
          errorType,
          getMessage(errorMessage),
          tirarAlertaDaLista,
          errorMessage
        );
        inserirMensagemNaLista(errorMessage);
      }
      break;
    case 422:
      if (substituiTratamentoDo422 != null && !hasAlertasRepetidos) {
        substituiTratamentoDo422();
        inserirMensagemNaLista(errorMessage);
      } else {
        let existeAlertasRepetidos;
        for (let error of errorList) {
          existeAlertasRepetidos = checarAlertaRepetido(error.message);
          if (existeAlertasRepetidos) {
            break;
          }
        }
        if (!existeAlertasRepetidos || showAlerta === false) {
          executaNoTratamentoDo422(errorList);
          for (let error of errorList) {
            inserirMensagemNaLista(error.message);
          }
        }
      }
      break;
    default:
      break;
  }

  return alert;
}

export function conexaoInvalidaHandler(
  errorMessage,
  message,
  checarAlertaRepetido,
  tirarAlertaDaLista,
  inserirMensagemNaLista
) {
  let haAlertasRepetidos = checarAlertaRepetido(errorMessage);
  if (!haAlertasRepetidos) {
    Alerta.handleAlert("error", message, tirarAlertaDaLista, errorMessage);
    inserirMensagemNaLista(errorMessage);
  }
}

export let receiveShowAlert = showAlert => {
  showAlerta = showAlert;
};
