import api from "./services/api";
import store from "./store/index";
import {
  changeIdioma,
  loginSucess,
  setSessaoSate
} from "./store/modules/Login/loginAction";
import {setFornecedorSuccess, setOrganizacaoSuccess} from "./store/modules/Organizacao/action";
import {menuItemRequest, menuSetURLPath} from "./store/modules/MenuItem/action";
import {useSelector} from "react-redux";

export const boot = () => {
  const access_token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const language = localStorage.getItem("language");
  const organizacao = localStorage.getItem("organizacao");
  const fornecedor = localStorage.getItem("fornecedor");
  const path = window.location.pathname.replace("/gp4", "").replace("/","")
  const module = path.substr(0, path.indexOf("/") === -1 ? path.length : path.indexOf("/"))

  if (access_token && user) {
    api.setAuth({ access_token, user });
    store.dispatch(
      setSessaoSate({
        isExpirada: false,
        isUsuarioLogado: true,
        rotaAtual: "login",
        isExibirModalLogin: false
      })
    );
    store.dispatch(loginSucess(user));
  }

  if (language) {
    api.setIdioma(language);
    store.dispatch(changeIdioma(language));
  }

  if (organizacao) {
    store.dispatch(setOrganizacaoSuccess(organizacao));
  }

  if (fornecedor) {
    store.dispatch(setFornecedorSuccess(fornecedor));
  }

  if(module) {
    store.dispatch(menuSetURLPath(path))
    if (path === 'prod/apontamento') {
      store.dispatch(menuItemRequest('apontamento'))
      return
    }
    store.dispatch(menuItemRequest(module))
  }
};
