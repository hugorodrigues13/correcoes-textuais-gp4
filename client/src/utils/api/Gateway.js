import "whatwg-fetch";
import { closeLoader, openLoader } from "../components/loading/Loading";
import headers from "../security/headers";
import { SERVER_URL } from "../config";
import { errorHandler } from "../components/utils/utils";
import store from "../store/index";
import { exibeModalLogin } from "../actions/sessaoAction";
import { checkResponseStatus } from "../handlers/responseHandlers";

// function complementUrl(method, entity, url, offset = null, limit = null) {
//   let id = entity ? entity.id : "";
//   if (
//     method === "PUT" ||
//     method === "DELETE" ||
//     method === "PATCH" ||
//     (method === "GET" && entity)
//   ) {
//     url += `/${id}`;
//   } else if (method === "GET" && !entity) {
//     if (offset || limit) {
//       if (!url.includes("?")) {
//         url += "?";
//       }
//     }
//     if (offset || typeof offset === "number") {
//       url += `offset=${offset}&`;
//     }
//     if (limit) {
//       url += `limit=${limit}`;
//     }
//   }
//   return url;
// }

function responseHandler(response) {
  closeLoader(false);
  return response;
}

export function apiConnection(
  contexto,
  method,
  entity = null,
  urlSuffix = "",
  silent = false
) {
  const sessao = store.getState().sessaoReducer.sassao;

  return new Promise((resolve, reject) => {
    let options = {
      method: method,
      headers: headers(),
      body: {}
    };

    if (method === "PUT" || method === "POST" || method === "PATCH") {
      options["body"] = entity;
    }
    openLoader(silent);
    fetch(SERVER_URL + urlSuffix, options)
      .then(checkResponseStatus)
      .then(r => {
        if (r.ok) {
          resolve(responseHandler(r));
        } else {
          if (r.status === 422) {
            errorHandler(contexto, r.response.data.errors, true);
          } else if (r.status === 401) {
            store.dispatch(exibeModalLogin(sessao.rotaAtual));
          } else if (r.status === 403) {
            errorHandler(contexto, r.response.data.messages, true);
          } else {
            errorHandler(
              contexto,
              [{ message: "erro.erroInesperado.mensagem", type: "error" }],
              true
            );
          }
        }
      })
      .then(json => {
        resolve(responseHandler(json));
      })
      .catch(error => {
        errorHandler(
          contexto,
          [{ message: "erro.erroInesperado.mensagem", type: "error" }],
          true
        );
        console.error("Gateway.js: Error -> " + error);
      });
  });
}
