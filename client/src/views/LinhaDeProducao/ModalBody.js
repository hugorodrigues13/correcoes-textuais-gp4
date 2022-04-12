import React, {useEffect, useState} from "react";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {useDispatch} from "react-redux";
import {restaurarLinhaProducaoRequest} from "../../store/modules/LinhaDeProducao/action";
import "./style.css";
import {CLIENT_URL} from "../../config";

export default function ModalBody({entities}) {
  const dispatch = useDispatch();

  const restaurar = (entity) => {
    dispatch(restaurarLinhaProducaoRequest(entity));
  }

  const editar = objeto => {
    return CLIENT_URL + "/cad/linhaDeProducao/form/" + objeto;
  };

  const configTable = () => {
    return {
      i18n: "linhaDeProducao.tabela.",
      columns: [
        {
          key: "nome",
        },
        {
          key: "versao",
          width: '20%',
        },
      ],
      data: entities,
      scroll: {y: 300},
      acoes: {
        restaurar: restaurar,
        visualizar: editar,
      }
    };
  };

  return (
    <TabelaAnt configTable={configTable()} loading={!entities}/>
  )
}
