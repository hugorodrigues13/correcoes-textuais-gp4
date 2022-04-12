import {
  START_REQUEST,
  FINISH_REQUEST
} from "../actionTypes";

export function startLoading() {
  return {
    type: START_REQUEST
  };
}

export function finishLoading() {
  return {
    type: FINISH_REQUEST
  };
}
