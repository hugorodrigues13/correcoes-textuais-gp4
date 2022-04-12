import api from "./api";

export const ServiceUser = {
  getTodosUsuarios: filtros => {
    return api.get("/user", {
      params: {
        ...filtros
      }
    });
  },

  getPerfil: () => {
    return api.get("/user/perfil");
  },

  getAcessosDoUsuario: () => {
    return api.get("/user/getAcessosDoUsuario");
  },

  getLinguagemPadrao: () => {
    return api.get("/user/getLinguagemPadraoUsuario");
  },

  getUsuarioLogado: () => {
    return api.post("/user/getUsuarioLogado");
  },

  deleteUser: id => {
    return api.delete(`/user/${id}`);
  },

  ativarDesativar: id => {
    return api.patch("/user/ativarOuDesativar", {
      id
    });
  },

  novo: () => {
    return api.get("/user/prepareNew");
  },

  preparaEditar: id => {
    return api.get("/user/prepareEdit", {
      params: { id }
    });
  },

  salvar: ({ entity }) => {
    return api.post(`/user`, {
      ...entity
    });
  },

  editar: ({ entity }) => {
    return api.put(`/user/${entity.id}`, {
      ...entity
    });
  },

  salvarDadosDoUsuario: ({ entity }) => {
    return api.put(`/user/salvarDadosDoUsuario`, {
      ...entity
    });
  },

  changeOrganizacao: ({ organizacaoId }) => {
    return api
      .get(`/user/changeOrganizacao`, {
        params: { organizacaoId }
      })
      .then(response => {
        const {
          refresh_token,
          username,
          access_token,
          roles,
          permissoes
        } = response.token;
        api.setAuth({
          access_token,
          refresh_token,
          user: { username, roles, permissoes }
        });
        return { username, roles, permissoes, fornecedores: response.fornecedores};
      });
  },

  changeFornecedor: ({ fornecedorId }) => {
    return api
      .get(`/user/changeFornecedor`, {
        params: { fornecedorId }
      })
      .then(response => {
        const {
          refresh_token,
          username,
          access_token,
          roles,
          permissoes
        } = response;
        api.setAuth({
          access_token,
          refresh_token,
          user: { username, roles, permissoes }
        });
        return { username, roles, permissoes };
      });
  },

  getRecursoPeloId:  id  => {
    return api.get( "/user/getRecursoPeloId", {
      params: { id }
    })
  },

  setUsuarioColunas:  (tipo, colunas)  => {
    return api.patch( "/user/editarColunas", {
      tipo,
      colunas
    })
  },

  getUsuarioColunas:  (tipo)  => {
    return api.get( "/user/getColunas", {
      params: {tipo}
    })
  },
};
