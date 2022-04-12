import moment from "moment";
import "moment-timezone";

const FormatadorTempo = tempo => {
  if (tempo !== undefined) {
    let tempoAtual = moment.tz(tempo, "America/Fortaleza");
    let tempoFormatado = tempoAtual.format("DD/MM/YYYY, HH:mm");
    return tempoFormatado;
  }
};

export default FormatadorTempo;
