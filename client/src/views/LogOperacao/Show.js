import React, { useEffect } from "react";
import history from "../../services/history";
import { FormattedMessage, injectIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as LogActions from "../../store/modules/LogOperacao/logOperacaoAction";
import {Button, PageHeader, Descriptions} from "antd";
import {CLIENT_URL} from "../../config";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

function Show({ intl, match }) {
  const dispatch = useDispatch();
  const { id } = match.params;

  useEffect(() => {
    if (id) dispatch(LogActions.getLogByIdRequest(id));
  }, [id, dispatch]);

  const logOperacao = useSelector(state => state.logOperacao.data);
  const { entity } = logOperacao ? (logOperacao.entity || {}) : {}

  function getValueEntity(name, entity) {
    if (entity && entity[name] && name === "data") {
      return new Date(entity[name]).toLocaleString();
    }  else if (entity && entity[name] && name === "tipoLogOperacao") {
      return getMessage(`logOperacao.tipoLogOperacao.${entity[name]}.label`)
    } else if (entity && (entity[name] || name === "persistedObjectVersion")) {
      return entity[name];
    }
    return "";
  }

  function getMessage (id) {
    return intl.formatMessage({ id: id });
  }

  function configTable(){
    return {
      i18n: "logOperacao.parametro.",
      columns: [
        { key: "tipo", isSorteable: true, render: (tipo) => getMessage(`logOperacao.parametroLogOperacao.${tipo}.label`)},
        { key: "valor", isSorteable: true}
      ],
      data: entity.parametros,
    };
  }

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => history.push(CLIENT_URL + "/audit/logOperacao")}
        title={getMessage("logOperacao.show.titulo")}
      />
      <br />

      <Descriptions title="" layout="vertical" bordered>
        <Descriptions.Item label={getMessage("logOperacao.usuario.label")}>{getValueEntity("usuario", entity)}</Descriptions.Item>
        <Descriptions.Item label={getMessage("logOperacao.tipoLogOperacao.label")}>{getValueEntity("tipoLogOperacao", entity)}</Descriptions.Item>
        <Descriptions.Item label={getMessage("logOperacao.tabela.data.label")}>{getValueEntity("data", entity)}</Descriptions.Item>
      </Descriptions>
      {entity && entity.parametros && <>
        <strong>{getMessage("logOperacao.parametros.label")}</strong>
        <TabelaAnt configTable={configTable()}/>
      </>}
    </div>
  );
}

export default injectIntl(Show);
