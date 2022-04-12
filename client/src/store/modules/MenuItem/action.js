//IMPORT ACTION_TYPES
import {MENU_ITEM_REQUEST, MENU_SET_URL_PATH} from "../actionTypes";

//SALVAR
export function menuItemRequest( module ){
  return {
    type: MENU_ITEM_REQUEST,
    module,
  }
}

export function menuSetURLPath( item ) {
  return {
    type: MENU_SET_URL_PATH,
    item
  }
}

