//IMPORT ACTION_TYPES
import {
  MENU_ITEM_REQUEST, MENU_SET_URL_PATH,
} from "../actionTypes";

const initialState = {
  module: '',
  item: ''
};

export function menuItemReducer(state = initialState, action) {
  switch (action.type) {
    case MENU_ITEM_REQUEST:
      return {
        ...state,
        module: action.module
      }
    case MENU_SET_URL_PATH:
      return {
        ...state,
        item: action.item
      }
    default:
      return state;
  }
}

