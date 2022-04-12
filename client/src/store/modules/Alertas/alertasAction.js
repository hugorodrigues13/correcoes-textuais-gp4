import { CHANGE_ALERTS_STATE } from "../actionTypes";
import store from "../../index";

export function setMessages(mensagens) {
  let alertas = store.getState().alertasReducer.messages;
  if (alertas === undefined || alertas === null) {
    alertas = {};
  }
  alertas = mensagens;
  return {
    type: CHANGE_ALERTS_STATE,
    messages: mensagens
  };
}
