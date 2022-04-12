export default () => {
  return {
    'Content-Type': 'application/json',
    'lang': localStorage.lang ? localStorage.lang : "pt-BR",
    'Authorization': `Bearer ${localStorage.auth ? JSON.parse(localStorage.auth).access_token : null}`
  }
}