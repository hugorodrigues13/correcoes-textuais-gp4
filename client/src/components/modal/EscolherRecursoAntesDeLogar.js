import React, {useEffect, useState} from "react"
import {CLIENT_URL} from "../../config";
import history from "../../services/history";
import {Modal, Button, Form, Row, Col, Select, Spin} from "antd";
import {injectIntl} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {setUserData} from "../../store/modules/User/action"
import {
  getDadosApontamentoPorRecursoRequest, getRecursosRequest, setMotivoParadaRequest,
  verificarParadaRequest
} from "../../store/modules/Apontamento/action"
import moment from "moment";
import {SelectFilter} from "../form/SelectFilter";
import {getMessage} from "../messages";
import {AiFillPrinter} from "react-icons/all";

function ModalEscolherRecurso({
                                visible,
                                intl,
                                handleOk,
                                handleCancel,
                                impressora,
                                setImpressora,
                                handleApontarOF
                              }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.requestManager)
  const {recursos} = useSelector(state => state.apontamento.recursos || {});
  const {parada, motivos, impressoras} = useSelector(state => state.apontamento);
  const loadingParada = useSelector(state => state.apontamento.loading)
  const recursoList = recursos;
  const [recurso, setRecurso] = useState(null);
  const [visibleSelect, setVisibleSelect] = useState("none");
  const [disable, setDisable] = useState(false);
  const [motivoEscolhido, setMotivoEscolhido] = useState(null)
  const [showImpressoras, setShowImpressoras] = useState(false)

  useEffect(() => {
    dispatch(getRecursosRequest())
  }, [])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const recursoSelecionado = user.recursoSelecionado
    if (recursos?.some(r => r.id === recursoSelecionado?.id)){
      setRecurso(recursoSelecionado)
    }
  }, [recursos]);

  useEffect(() => {
    if (recurso?.id){
      dispatch(verificarParadaRequest(recurso.id))
      dispatch(getDadosApontamentoPorRecursoRequest(recurso.id))
    }
  }, [recurso])

  useEffect(() => {
    if (impressoras?.length > 0) {
      const imp = JSON.parse(localStorage.getItem("impressora"))
      setImpressora(imp)
      setShowImpressoras(true)
    } else {
      setImpressora("")
      setShowImpressoras(false)
    }
  }, [impressoras]);

  useEffect(() => {
    if (isEmpty(recursoList)) {
      setVisibleSelect("inline")
      setDisable(true);
    } else {
      setVisibleSelect("none")
      setDisable(false);
    }
  }, [recursoList, motivos, parada]);

  useEffect(() => {
    if(visible) {
      setMotivoEscolhido(null);
      for(let item of document.getElementsByClassName("semHeader")) {
        item.className = item.className+" openedModal"
      }
    } else {
      for(let item of document.getElementsByClassName("semHeader")) {
        item.className = item.className.replace("openedModal", "")
      }
    }
  }, [visible])

  return (
    <Modal
      visible={visible}
      title={getMessage("escolherRecurso.modal.title.label")}
      getContainer="#divFormModalApontamento"
      destroyOnClose={true}
      onOk={confirmar}
      closable={false}
      footer={renderFooter()}
    >
      <Spin spinning={loading}>
        <Form layout={"vertical"}>
          {renderSelectRecurso()}
          {showImpressoras && renderSelectImpressora()}
          {parada?.id && !isEmpty(recursoList) && renderSelectParada()}
        </Form>
        {renderMensagens()}
      </Spin>
    </Modal>
  );

  function renderFooter(){
    const footer = [
      <Button
        key={"cancel"}
        type="default"
        onClick={() => history.push(CLIENT_URL)}
      >
        {getMessage("comum.cancelar.label")}
      </Button>
      ,
      recurso?.permiteApontamentoOF ?
        <Button
          key="submit"
          type="danger"
          loading={loadingParada}
          hidden={!recurso?.permiteApontamentoOF}
          disabled={disable || (showImpressoras && !impressora?.id) || (parada?.id && !motivoEscolhido)}
          onClick={apontarOF}
        >
          {getMessage("apontamento.apontarOF.label")}
        </Button> :
      <Button
        key="submit"
        type="primary"
        loading={loadingParada}
        disabled={disable || (showImpressoras && !impressora?.id) || (parada?.id && !motivoEscolhido)}
        onClick={confirmar}
      >
        {getMessage("comum.ok.label")}
      </Button>
    ]

    return footer
  }

  function renderSelectRecurso(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label={"Recurso"}>
            <Select
              showSearch
              onChange={handleChange}
              value={recurso ? recurso.id : null}
              placeholder={"Selecione um recurso"}
              disabled={disable}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                (recursoList || [])
                  .map(recurso => (
                    <Select.Option value={recurso.id} key={recurso.id} style={{overflow: 'hidden'}}>
                      {recurso.nome}
                    </Select.Option>
                  ))
              }
            </Select>
          </Form.Item>
        </Col>
      </Row>
    )
  }

  function renderSelectParada() {
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item style={{marginBottom: 0}} label={getMessage("apontamento.informeMotivo.label")}>
            <Select
              showSearch
              value={motivoEscolhido}
              onChange={(e) => setMotivoEscolhido(e)}
              placeholder={getMessage("apontamento.informeMotivo.label")}
              disabled={parada?.id && !motivos?.length}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                (motivos || [])
                  .map(motivo => (
                    <Select.Option value={motivo.id} key={motivo.id} style={{overflow: 'hidden'}}>
                      {motivo.motivo}
                    </Select.Option>
                  ))
              }
            </Select>
          </Form.Item>

        </Col>
        <Col span={24}>
          <div style={{
            fontSize: '16px',
            color: "red",
            marginTop: 10,
          }}>{getMessage("apontamento.recursoParadoDesde.label") + moment(parada.inicio).format("DD/MM/YYYY HH:mm:ss")}</div>
        </Col>
      </Row>
    )
  }

  function renderSelectImpressora(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label={getMessage("apontamento.impressora.label")}>
            <SelectFilter
              placeholder={getMessage("apontamento.selecionarImpressora.label")}
              list={(impressoras || []).map(imp => {
                return {
                  key: imp.key,
                  value: imp.apelido
                }
              })}
              hasFormItem={false}
              value={impressora?.id}
              nomeAtributo={"impressora"}
              suffixIcon={<AiFillPrinter size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
              onChange={e => salvarImpressora(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    )
  }

  function renderMensagens(){
    return (
      <>
        {(parada?.id && !motivos.length) &&  <div style={{
          fontSize: '16px',
          color: "red",
        }}>
          {getMessage("apontamento.nenhumMotivo.label")}
        </div>}

        <div style={{
          display: visibleSelect,
          fontSize: '16px',
          textAlign: "right",
          width: '200px',
          color: "red",
        }}>
          {getMessage("apontamento.semRecurso.label")}
        </div>
      </>
    )
  }

  function getMessage(id) {
    return intl.formatMessage({ id });
  }

  function apontarOF() {
    if(recurso) {
      setDadosPorRecurso()
      handleApontarOF()
    }
  }

  function confirmar() {
    if (recurso) {
      setDadosPorRecurso()
      handleOk();
    }
  }

  function setDadosPorRecurso() {
    let user = JSON.parse(localStorage.getItem("user"));
    user.recursoSelecionado = recurso;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(setUserData(recurso));
    dispatch(getDadosApontamentoPorRecursoRequest(recurso.id))
    if (parada?.id && motivoEscolhido){
      dispatch(setMotivoParadaRequest(parada?.id, motivoEscolhido))
    }
  }

  function handleChange(e) {
    setRecurso(recursoList.find(r => r.id === e));
  }

  function salvarImpressora(impressora) {
    console.log(impressora)
    const imp = impressoras.find(i => i.id == impressora)
    localStorage.setItem("impressora", JSON.stringify(imp));
    setImpressora(imp)
  }

}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true;
}
export default injectIntl(ModalEscolherRecurso)
