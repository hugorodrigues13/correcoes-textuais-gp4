import Alert from "react-s-alert";

export const httpSucessMessage = mensagens => {
  let options ={};
  mensagens.forEach(message => {
    if(message.timeout){
      options.timeout = message.timeout
    }
    if (message.type === "SUCCESS_TYPE") {
      Alert.success(message.message, options);
    }
    else if(message.type === "ERROR_TYPE"){
      Alert.error(message.message, options);
    }
    else if(message.type === "WARNING_TYPE"){
      Alert.warning(message.message, options);
    }
  });
};
