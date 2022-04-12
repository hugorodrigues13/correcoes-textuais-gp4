import React, {useEffect, useRef, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Input, PageHeader, Popconfirm, Popover, Row, Spin, Tooltip} from "antd";
import {InputAnt} from "../../components/form/Input";
import {FormattedMessage, injectIntl} from "react-intl";
import {AiFillClockCircle, AiFillPrinter, AiOutlinePause, FaPrint} from "react-icons/all";
import {
  apontamentoGerarEtiquetaRequest,
  apontamentoSalvarRequest, apontamentoValidarOFRequest,
  apontamentoValidarSerialRequest,
  fecharModal,
  limparSeriais,
  pararRecursoRequest,
  verificarUsuarioRequest
} from "../../store/modules/Apontamento/action";
import Modal from "./Modal";
import {getMessage} from "../../components/messages";
import ModalEscolherRecurso from "../../components/modal/EscolherRecursoAntesDeLogar";
import Alert from "react-s-alert";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import "./style.css";
import {useMediaQuery} from "react-responsive";
import {Alert as AntAlert} from "antd"
import * as moment from "moment";
import {humanizeDurationShort} from "../../utils/utils";

const ApontamentoForm = ({apontamento}) => {

  const {showModal, etiqueta, recurso, ultimoApontamento, tempoMaximoSemApontamento, dadosSerial, totalSeriais } = useSelector(store => store.apontamento);
  const {loading} = useSelector(store => store.requestManager);
  const [serial, setSerial] = useState("");
  const [recursos, setRecursos] = useState("");
  const [recursoLocalStorage, setRecursoLocalStorage] = useState("");
  const [modalEscolherRecurso, setModalEscolherRecurso] = useState(false)
  const [focusSerial, setFocusSerial] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [impressora, setImpressora] = useState("")
  const telaPequena = useMediaQuery({ query: '(max-width: 1280px)' })
  const [parandoEm, setParandoEm] = useState(null)
  const locale = (useSelector(state => state.sessaoReducer.language) || "pt-BR").split("-")[0]
  const [apontarOF, setApontarOF] = useState(false)

  useEffect(() => {
    if(apontamento.seriais.length > 0 && apontamento.seriais[0].situacao === "ERROR_TYPE"){
      setSerial('')
    }
  },[apontamento.seriais])

 useEffect(() => {
    if(recursoLocalStorage !== "" && recursoLocalStorage !== recurso) {
      localStorage.removeItem("seriais")
      dispatch(limparSeriais())
    }
  }, [recursos]);

  useEffect(() => {
    if (modalEscolherRecurso || !ultimoApontamento || !tempoMaximoSemApontamento) return
    const date = new Date(ultimoApontamento + (tempoMaximoSemApontamento * 1000) + 10000)
    if (date.getTime() <= new Date().getTime()) return
    setParandoEm(moment(date))
  }, [modalEscolherRecurso, ultimoApontamento, tempoMaximoSemApontamento])

  useEffect(() => {
    if (!parandoEm) return

    const timer = setInterval(() => {
      const difference = parandoEm.diff(new Date(), 'milliseconds')
      form.setFieldsValue({
        parandoEm: humanizeDurationShort(difference, {language: locale})
      })
      if (difference <= 0 && !modalEscolherRecurso && !loading){
        pararRecurso(false)
      }
    }, 1000)

    if(modalEscolherRecurso) {
      clearTimeout(timer)
      form.setFieldsValue({
        parandoEm: 0
      })
    }
    return () => {
      clearTimeout(timer)
    }

  }, [parandoEm, modalEscolherRecurso, loading])

  useEffect(() => {
    setModalEscolherRecurso(true);
    setParandoEm(null)
    form.setFieldsValue({
      parandoEm: 0
    })
    document.title = getMessage("apontamento.title.label");
    const userDetails = JSON.parse(localStorage.getItem("user"))
    if(userDetails.hasOwnProperty("recursoSelecionado")) {
      setRecursoLocalStorage(userDetails.recursoSelecionado.id)
    }
  }, []);

  useEffect(() => {
      const serialVazio = !serial && !loading && !showModal
    if (serialVazio ) {
      inputRef.current.focus();
    }
  }, [focusSerial, serial, loading, showModal])

  useEffect(() => {
    if (etiqueta !== null && etiqueta !== undefined && etiqueta.length) {
      if(etiqueta.every(etq => etq.success)) {
        Alert.success(etiqueta[0].message)
      } else {
        etiqueta.filter(etq => !etq.success).forEach(etq => {
            Alert.warning(etq.message)
        })
      }
      //baixarPdfEtiqueta(etiqueta)
    }
  }, [etiqueta]);

  const colorRender = (value, record) => {
    if (record.situacao === "SUCCESS_TYPE"){
      return <div style={{color: record.reprocesso ? "#BBBB00" : "#00AA00" }}>{value}</div>
    } else {
      return <div style={{color: record.cor || "#DD0000" }}>{value}</div>
    }
  }

  const configTable = () => {
    function renderDuasColunas(valor1, valor2, record){
      return <div style={{ textAlign: 'center', display: 'block' }}>
        <div style={{ height: 22 }}>
          {colorRender(valor1, record)}
        </div>
        <div style={{height: 22}}>
          {colorRender(valor2, record)}
        </div>
      </div>
    }
    function renderBotaoReimpressao(record){
      return (
        <Tooltip
          placement="bottom"
          title={getMessage("comum.reimpressao.label")}
        >
          <Button
            disabled={!impressora?.id || record.situacao === 'ERROR_TYPE' || !record.caixa || !record.etiquetaImpressa}
            type="link default"
            onClick={() => reimpressao(record)}
          >
            <FaPrint size={16} />
          </Button>
        </Tooltip>
      )
    }
    function renderDescricao(value, record){
      if (record.situacao === "SUCCESS_TYPE"){
        return (
          <Popover placement={"left"} content={record.proximoProcesso || value}>
            <AntAlert
              className={!record.reprocesso ? "apontamento-success-alert" : "apontamento-warning-alert"}
              message={(record.proximoProcesso || getMessage("apontamento.situcao.SUCESSO.label")).substring(0, 9)}
              type={record.reprocesso ? "warning" : "success"}
            />
          </Popover>
        )
      } else {
        const style = record.cor ? {
          backgroundColor: record.cor,
          color: "#FFF"
        } : {}
        return (
          <Popover placement={"left"} content={value}>
            {
              record.cor ? <div style={style}  className={"ant-alert"}>{getMessage("apontamento.situcao.ERRO.label")}</div>  :
                <AntAlert style={style} className={"apontamento-error-alert"} message={getMessage("apontamento.situcao.ERRO.label")} type="error" />
            }

          </Popover>
        )
      }
    }
    const colunas = (apontarOF ? ["ordemDeFabricacao", "codigoProduto", "modelo", "comprimento", "dataApontamento", "descricao"] :
      ["serial", "ordemFabricacao", "codigoProduto", "lote", "caixa", "modelo", "comprimento", "dataApontamento", "descricao"]).map(c => ({key: c, render: colorRender}))
    let colunasPequenas = [
      {key: apontarOF ? "ordemDeFabricacao" : "serial", width: 90, render: (value, record) => renderDuasColunas(record.serial || record.ordemDeFabricacao, apontarOF ? null : renderBotaoReimpressao(record), record)},
      {key: "cpOf", width: 90, render: (value, record) => renderDuasColunas(record.codigoProduto, record.ordemFabricacao, record)},
    ]

    if(!apontarOF) {
      colunasPequenas.push({key: "loteCaixa", width: 105, render: (value, record) => renderDuasColunas(record.lote, record.caixa, record)})
    }

    colunasPequenas = colunasPequenas.concat([
      {key: "modelo", width: telaPequena ? 120 : 100, render: colorRender},
      {key: "comp", render: (value, record) => colorRender(record.comprimento, record)},
      {key: "data", width: telaPequena ? 50 : 80, render: (value, record) => colorRender(record.dataApontamento, record)},
      {key: "descricao", render: renderDescricao},
    ])

    return ({
      i18n: "apontamento.tabela.",
      columns: telaPequena ? colunasPequenas : colunas,
      data: (apontamento.seriais || []).sort(function (a, b) {
        return a.dataApontamento > b.dataApontamento ? -1 : a.dataApontamento < b.dataApontamento ? 1 : 0
      }),
      size: telaPequena && "small",
      acoes: !telaPequena && {
        impressao: reimpressao,
        impressaoProps: (record) => ({
          disabled: !impressora?.id || record.situacao === 'ERROR_TYPE' || !record.caixa || !record.etiquetaImpressa
        })
      },
    });
  };

  function reimpressao(entity){
    dispatch(apontamentoGerarEtiquetaRequest({
      serial: entity.serial,
      recurso: recursoLocalStorage,
      impressora: impressora
    }))
  }

  return (
    <>
      <PageHeader
        title={<FormattedMessage id="apontamento.listagem.label"/>}
        className={"apontamentoHeader"}
      />
      <div id="divFormModalApontamento" className="divFormModalApontamento">
        <Spin spinning={loading}>
          {renderForm()}
          <br/>
          <TabelaAnt configTable={configTable()} />
        </Spin>
      </div>
      {renderModals()}
    </>
  );

  function renderForm(){
    function setCampoSerial(e) {
      let str = e.target.value.replace(/[^0-9a-zA-Zs-]/g, '');
      setSerial(str)
      form.setFieldsValue({serial: str})
    }
    function handleKeyPress(e) {
      if (e.keyCode == 9 || e.keyCode == 13) {
        if (serial === ''){
          Alert.error(getMessage(apontarOF ? 'apontamento.of.error' : 'apontamento.serial.error'))
        } else {
          if(apontarOF) {
            dispatch(apontamentoValidarOFRequest(serial, recursos, apontamento.seriais, impressora?.id))
          } else {
            dispatch(apontamentoValidarSerialRequest(serial, recursos, apontamento.seriais, impressora?.id))
          }

          form.setFieldsValue({serial: ''})
        }
      }

      setFocusSerial(true);
    }
    function renderSerial(){
      return (
        <Form.Item
          label={apontarOF ? getMessage("apontamento.ordemDeFabricacao.label") : getMessage("apontamento.serial.label")}
          name={"serial"}>
          <Input
            onChange={setCampoSerial}
            autoFocus
            disabled={loading || showModal || modalEscolherRecurso}
            onKeyDown={handleKeyPress}
            size={"large"}
            value={apontamento.serial}
            message={getMessage("comum.obrigatorio.campo.message")}
            isRequired="true"
            placeholder={apontarOF ? getMessage("apontamento.tabela.ordemDeFabricacao.label") : getMessage("apontamento.tabela.serial.label")}
            ref={inputRef}
          />
        </Form.Item>
      )
    }
    function renderRecurso(){
      return (
        <InputAnt
          disabled
          label={getMessage("apontamento.recurso.label")}
          nomeAtributo={"recurso"}
          message={getMessage("comum.obrigatorio.campo.message")}
        />
      )
    }
    function renderImpressora(){
      return (
        impressora && <InputAnt
          disabled
          suffixIcon={<AiFillPrinter size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
          label={getMessage("apontamento.impressora.label")}
          nomeAtributo={"impressora"}
          message={getMessage("comum.obrigatorio.campo.message")}
        />
      )
    }

    function renderTimer() {
      return <InputAnt
        disabled
        suffixIcon={<AiFillClockCircle size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
        label={getMessage("apontamento.parandoEm.label")}
        nomeAtributo={"parandoEm"}
      />
  }

    function renderParar(){
      return (
        <Popconfirm
          cancelText={getMessage("comum.nao.label")}
          okText={getMessage("comum.sim.label")}
          title={getMessage("apontamento.parar.confirmar.label")}
          onConfirm={() => pararRecurso(true)}
        >
          <Button
            type="danger"
            id={"pararButton"}
            icon={<AiOutlinePause style={{fontSize: 20, verticalAlign: 'middle'}}/>}
            size="large"
            style={{
              width: '100%',
              marginTop: 30,
            }}
          >
            {!telaPequena && getMessage("apontamento.parar.label")}
          </Button>
        </Popconfirm>
      )
    }
    return (
      <Form form={form} layout={"vertical"}>
        {telaPequena ? <>
            <Row gutter={24}>
              <Col span={21} id='recurso-wrapper'>
                {renderRecurso()}
              </Col>
              <Col id='botao-parada-wrapper' span={3}>
                {renderParar()}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6} id='serial-wrapper'>
                {renderSerial()}
              </Col>
              <Col span={14} id='impressora-wrapper'>
                {renderImpressora()}
              </Col>
              <Col span={4} id='timer-wrapper'>
                {renderTimer()}
              </Col>
            </Row>
        </>
         : <>
            <Row gutter={24}>
              <Col span={5}>
                {renderSerial()}
              </Col>
              <Col span={5}>
                {renderRecurso()}
              </Col>
              <Col span={6}>
                {renderImpressora()}
              </Col>
              <Col span={5}>
                {renderTimer()}
              </Col>
              <Col span={3}>
                {renderParar()}
              </Col>
            </Row>
          </>
        }

      </Form>
    )
  }

  function renderModals(){
    return (
      <>
        <Modal
          visible={showModal}
          handleHiddenModal={handleHiddenModal}
          handleCancel={handleCancel}
          serial={serial}
          recurso={recursos}
          impressora={impressora}
          onSave={handleSaveValue}
          onLogin={handleLoginValue}
          changeFocusSerial={changeFocusSerial}
          dadosSerial={dadosSerial}
          totalSeriais={totalSeriais}
          apontarOF={apontarOF}
        >
        </Modal>
        <ModalEscolherRecurso
          visible={modalEscolherRecurso}
          handleOk={handleHiddenModalEscolher}
          handleApontarOF={handleApontarOF}
          handleCancel={handleHiddenModalEscolher}
          impressora={impressora}
          setImpressora={setImpressora}
        />
      </>
    )
  }

  function changeFocusSerial(value) {
    setFocusSerial(value);
  }

  function setCampoRecurso() {
    const user = JSON.parse(localStorage.getItem("user"))
    const recursoSelecionado = user.recursoSelecionado;
    setRecursos(recursoSelecionado ? recursoSelecionado.id : null)
    form.setFieldsValue({
        recurso: recursoSelecionado ? recursoSelecionado.nome : null,
        impressora: impressora ? impressora.apelido : null,
    })
  }

  function handleCancel() {
    dispatch(fecharModal());
    setSerial('')
  }

  function handleHiddenModal() {
    dispatch(fecharModal());
  }

  function handleHiddenModalEscolher() {
    setModalEscolherRecurso(false);
    setCampoRecurso();
    setApontarOF(false)
  }

  function handleApontarOF() {
    setModalEscolherRecurso(false)
    setCampoRecurso()
    setApontarOF(true)
  }

  function handleSaveValue(objeto) {
    const {seriais} = apontamento
    dispatch(apontamentoSalvarRequest({...objeto, seriais, apontarOF}));
    handleHiddenModal()
    setFocusSerial(!focusSerial)
    setSerial("");
  }

  function handleLoginValue(objeto) {
    const {seriais} = apontamento
    dispatch(verificarUsuarioRequest({...objeto, seriais}));
    handleHiddenModal()
    setSerial("");
  }

  function pararRecurso(acaoDoUsuario){
    const userDetails = JSON.parse(localStorage.getItem("user"))
    const local =userDetails.hasOwnProperty("recursoSelecionado") ? userDetails.recursoSelecionado.id : null
    const recursoId = recursoLocalStorage || local
    if (!recursoId){
      return
    }
    dispatch(pararRecursoRequest(recursoId, acaoDoUsuario))
    setModalEscolherRecurso(true);
  }
}

const mapStateToProps = store => ({
  apontamento: store.apontamento,
});

export default injectIntl(connect(mapStateToProps)(ApontamentoForm));

