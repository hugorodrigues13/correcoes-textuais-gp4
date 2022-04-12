import React, { useEffect } from "react";
import history from "../../services/history";
import {  injectIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as AuditoriaActions from "../../store/modules/Auditoria/auditoriaAction";
import {  PageHeader, Descriptions } from "antd";
import { CLIENT_URL } from "../../config";

function Show({ intl, match }) {
  const { id } = match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) dispatch(AuditoriaActions.getAuditoriaByIdRequest(id));
  }, [id, dispatch]);

  const auditoria = useSelector(state => state.auditoria.data);
  const { auditoriaEntity: entity } = auditoria || {};

  function getValueEntity(name, entity) {
    if (entity && (entity[name] || name === "persistedObjectVersion")) {
      return entity[name];
    }
    return "";
  }
  function getMessage(id) {
    return intl.formatMessage({ id: id });
  }

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => history.push(CLIENT_URL + "/audit/auditoria")}
        title={getMessage("auditoria.show.titulo")}
      />
      <br />
      <Descriptions title="" layout="vertical" bordered>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.persistedObjectId.label")}
        >
          {getValueEntity("persistedObjectId", entity)}
        </Descriptions.Item>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.className.label")}
        >
          {entity ? entity.className.split(".")[4] : ""}
        </Descriptions.Item>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.persistedObjectVersion.label")}
        >
          {getValueEntity("persistedObjectVersion", entity)}
        </Descriptions.Item>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.dateCreated.label")}
        >
          {entity && entity.dateCreated
            ? new Date(entity.dateCreated).toLocaleString()
            : ""}
        </Descriptions.Item>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.lastUpdated.label")}
        >
          {entity && entity.lastUpdated
            ? new Date(entity.lastUpdated).toLocaleString()
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label={getMessage("auditoria.username.label")}>
          {getValueEntity("actor", entity)}
        </Descriptions.Item>
        <Descriptions.Item
          label={getMessage("auditoria.tabela.eventName.label")}
        >
          {getValueEntity("eventName", entity)}
        </Descriptions.Item>
        <Descriptions.Item label={getMessage("auditoria.show.valorAntigo")}>
          {getValueEntity("oldValue", entity) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label={getMessage("auditoria.show.valorNovo")}>
          {getValueEntity("newValue", entity)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default injectIntl(Show);
