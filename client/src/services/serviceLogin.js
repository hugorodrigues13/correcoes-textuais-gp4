import api from "./api";

export const ServiceLogin = {
  login: user => {
    const { username, password, token } = user;
    const organizacao = localStorage.getItem('organizacao')
    const fornecedor = localStorage.getItem('fornecedor')
    return api
      .post("/login", { username, password, organizacao, token, fornecedor })
      .then(response => {
        const {
          refresh_token,
          username,
          access_token,
          roles,
          permissoes
        } = response;
        const isSelecionarRecurso = permissoes.indexOf("Selecionar Recurso ao Entrar no Sistema") > -1;
        api.setAuth({
          access_token,
          refresh_token,
          user: { username, roles, permissoes, isSelecionarRecurso}
        });
        return { username, roles, permissoes, isSelecionarRecurso };
      });
  },

  refreshToken: () => {
    return api.post("/oauth/access_token");
    // return fetch(`${SERVER_URL}/oauth/access_token`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    //   },
    //   body: qs.stringify({
    //     grant_type: "refresh_token",
    //     refresh_token: JSON.parse(localStorage.auth).refresh_token
    //   })
    // })
    //   .then(checkResponseStatus)
    //   .then(a => (localStorage.auth = JSON.stringify(a)))
    //   .catch(() => {
    //     throw new Error("Unable to refresh!");
    //   });
  }
};
