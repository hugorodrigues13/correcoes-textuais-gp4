export default {
  logIn(auth) {
    localStorage.isSessaoExpirada = false;
    localStorage.auth = JSON.stringify(auth);
  },

  logOut() {
    delete localStorage.isSessaoExpirada;
    delete localStorage.auth;
  },

  loggedIn() {
    return localStorage.auth;
  },

  isAdministrador() {
    return JSON.parse(localStorage.user).roles.includes("ROLE_ADMINISTRADOR");
  },

  username() {
    return JSON.parse(localStorage.user).username;
  },

  toJson() {
    return JSON.parse(localStorage.user);
  },

  setIsSessaoExpirada(isSessaoExpirada) {
    delete localStorage.isSessaoExpirada;
    localStorage.isSessaoExpirada = isSessaoExpirada;
  },

  isSessaoExpirada() {
    return localStorage.isSessaoExpirada === "true";
  },

  setLang(lang) {
    delete localStorage.lang;
    localStorage.lang = lang;
  }
};
