import messages_pt_BR from './messages_pt_BR';
import messages_en_US from './messages_en_US';
import messages_es_ES from './messages_es_ES';

export default {
    'en-US': messages_en_US,
    'pt-BR': messages_pt_BR,
    'es-ES': messages_es_ES
}

export const getMessagesByCurrentLanguage = () => {
  let idioma = localStorage.getItem("language");
  if(idioma === "en-US"){
    return messages_en_US
  }else if(idioma === "es-ES"){
    return messages_es_ES
  }else{
    return messages_pt_BR
  }
};

export const getMessage = (id) => {
  const messages = getMessagesByCurrentLanguage();
  let message = messages[id];
  if(message) return message;
  else return id
};
