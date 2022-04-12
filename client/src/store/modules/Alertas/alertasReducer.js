import { CHANGE_ALERTS_STATE } from "../actionTypes";

const initialState = {
  messages: [{ message: "login.credenciais.messagem", type: "info", field: "" }]
};

export function alertasReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ALERTS_STATE:
      return {
        ...state,
        messages: action.messages
      };
    default:
      return state;
  }
}
