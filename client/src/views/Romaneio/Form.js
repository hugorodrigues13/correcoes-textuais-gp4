import * as React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, InputNumber, Popconfirm, Row, Table, Tooltip} from "antd";
import "./style.css";
import {FormattedMessage} from "react-intl";
import {InfoCircleOutlined} from "@ant-design/icons";
import {getMessage} from "../../components/messages";
import {
  mudarRomaneioVolumeRequest,
  historicoRomaneioRequest,
  editarNfsRomaneioRequest
} from "../../store/modules/Romaneio/action";
import {AiFillEdit, AiFillSave, AiOutlineFileText, AiOutlineSave} from "react-icons/all";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {useEffect, useState} from "react";
import DadosModal from "./DadosModal";
import {InputAnt} from "../../components/form/Input";
function RomaneioForm(props) {

  const dispatch = useDispatch();
  const romaneio = useSelector(state => state.romaneio)
  const roles = useSelector(state => state.sessaoReducer)?.data?.roles || []
  const entity = romaneio.data?.entity || {}

  const [expanded, setExpanded] = useState([])
  const [dadosModalOpen, setDadosModalOpen] = useState(false)
  const [volume, setVolume] = useState(0)
  const [popConfirmVisible, setPopConfirmVisible] = useState(false)
  const [nfForm] = Form.useForm()
  const [nfFoiEditada, setNfFoiEditada] = useState(false)

  useEffect(() => {
    setExpanded(entity.servicos?.map(servico => servico.key))
    setVolume(entity.volume)
    nfForm.setFieldsValue({
      nfEncomenda: entity.notaFiscalEncomenda?.codigo || '-',
      nfRetorno: entity.notaFiscalRetorno?.codigo || '-',
    })
    handleChangeNfFoiEditada()
  }, [entity, entity.volume])

  const handleChangeNfFoiEditada = () => {
    setNfFoiEditada(nfForm.getFieldValue('nfEncomenda') !== (entity.notaFiscalEncomenda?.codigo || '-')
      || nfForm.getFieldValue('nfRetorno') !== (entity.notaFiscalRetorno?.codigo || '-'))
  }

  function preparaCampo({ target }) {
    if(target.name === 'nfEncomenda' && target.value === '-') nfForm.setFieldsValue({ nfEncomenda: '' });
    if(target.name === 'nfEncomenda' && target.value.trim() === '') nfForm.setFieldsValue({ nfEncomenda: '-' });
    if(target.name === 'nfRetorno' && target.value === '-') nfForm.setFieldsValue({ nfRetorno: '' });
    if(target.name === 'nfRetorno' && target.value.trim() === '') nfForm.setFieldsValue({ nfRetorno: '-' });
  }

  function renderQuadroInfos() {
    const podeEditarNF = () => {
      const isEditor = roles.includes("ROLE_EDITOR_DE_NOTAS_FISCAIS")

      return isEditor && (entity.status === "ABERTO" || entity.status === "FECHADO")
    }
    const editarNfs = (values) => {
      values.nfEncomenda = (values.nfEncomenda === '-') ? null : values.nfEncomenda
      values.nfRetorno = (values.nfRetorno === '-' )? null : values.nfRetorno
      dispatch(editarNfsRomaneioRequest(props.id, values.nfEncomenda, values.nfRetorno))
    }
    return <div className="romaneio-quadro-infos">
      <Form
        form={nfForm}
        layout={"horizontal"}
        onFieldsChange={handleChangeNfFoiEditada}
        onFinish={editarNfs}
      >
        <Row gutter={24} style={{alignItems: 'baseline'}}>
          <Col span={13} style={{height: 24}}>
            <InputAnt
              label={getMessage("romaneio.dados.quadroInfo.nfEncomenda.label")}
              nomeAtributo={"nfEncomenda"}
              disabled={!podeEditarNF()}
              suffixIcon={podeEditarNF() && <AiFillEdit />}
              onFocus={preparaCampo}
              handleConfirmBlur={preparaCampo}
              ghost
            />
          </Col>
          <Col span={9}>
            <span style={{fontWeight: 'bold'}}>{getMessage("romaneio.dados.quadroInfo.status.label")}:</span>
            <span> {getMessage(`romaneio.dados.quadroInfo.status.${entity.notaFiscalEncomenda?.status || "PROCESSAMENTO"}.label`)}</span>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={13} style={{height: 24}}>
            <InputAnt
              label={getMessage("romaneio.dados.quadroInfo.nfRetorno.label")}
              nomeAtributo={"nfRetorno"}
              disabled={!podeEditarNF()}
              suffixIcon={podeEditarNF() && <AiFillEdit />}
              onFocus={preparaCampo}
              handleConfirmBlur={preparaCampo}
              ghost
            />
          </Col>
          <Col span={9}>
            <span style={{fontWeight: 'bold'}}>{getMessage("romaneio.dados.quadroInfo.status.label")}:</span>
            <span> {getMessage(`romaneio.dados.quadroInfo.status.${entity.notaFiscalRetorno?.status || "PROCESSAMENTO"}.label`)}</span>
          </Col>
        </Row>
        {(entity.mensagemIntegracao) ? <Row gutter={24} style={{marginTop: 5}}>
          <Col span={1}/>
          <Col span={22}>
            <span style={{fontWeight: 'bold'}}> {getMessage("romaneio.dados.quadroInfo.mensagem.label")}: </span>
            <span> {entity.mensagemIntegracao || ""}</span>
          </Col>
        </Row> : null}
      </Form>
      {nfFoiEditada && (
          <Tooltip title={getMessage("romaneio.dados.quadroInfo.salvar.label")}>
            <Button onClick={nfForm.submit} style={{position: 'absolute', right: 10, top: 5, border: 0, padding: 0}}>
              <AiOutlineSave size={20}/>
            </Button>
          </Tooltip>
        )}
    </div>;
  }

  function renderLotes() {
    return (
          <Row gutter={24} style={{marginTop: 10}} className="romaneio-cabecalho-row">
            <Col span={24}>
              {getMessage("romaneio.dados.lotes.label")}: <span style={{fontWeight: "bold"}}>{ entity.lotesString } </span>
            </Col>
          </Row>
      )
  }

  function renderCabecalho() {
    function openModal(){
      setDadosModalOpen(true)
      dispatch(historicoRomaneioRequest(props.id))
    }
    return (
      <>
        <Row gutter={24} style={{marginTop: 10}} className="romaneio-cabecalho-row">
          <Col span={8}>
            {getMessage("romaneio.cabecalho.romaneio.label")}:
            <span> {entity.romaneio}</span>
            <Button className="romaneio-ghost-button" onClick={openModal}>
              <AiOutlineFileText style={{fontSize: 22}}/>
            </Button>
          </Col>
          <Col span={8}>
            {getMessage("romaneio.cabecalho.data.label")}:
            <span> {entity.emissao}</span>
          </Col>
          <Col span={8}>
            {getMessage("romaneio.cabecalho.status.label")}:
            <span> {getMessage(`romaneio.cabecalho.status.${entity.status}.label`)}</span>
          </Col>
        </Row>
        <Row gutter={24} className="romaneio-cabecalho-row">
          <Col span={8}>
            {getMessage("romaneio.cabecalho.cliente.label")}:
            <span> Furukawa Eletric Latam</span>
          </Col>
          <Col span={8}>
            {getMessage("romaneio.cabecalho.cpfCnpj.label")}:
            <span> 51775690/000191</span>
          </Col>
          <Col span={8}>
            {getMessage("romaneio.cabecalho.ieRg.label")}:
            <span> 10136200004</span>
          </Col>
        </Row>
        <Row gutter={24} className="romaneio-cabecalho-row">
          <Col span={8}>
            {getMessage("romaneio.cabecalho.endereco.label")}:
            <span> Rua Hasdrubal Bellegard, 820</span>
          </Col>
          <Col span={4}>
            {getMessage("romaneio.cabecalho.bairro.label")}:
            <span> CIC</span>
          </Col>
          <Col span={4}>
            {getMessage("romaneio.cabecalho.cidade.label")}:
            <span> Curitiba</span>
          </Col>
          <Col span={8}>
            {getMessage("romaneio.cabecalho.cep.label")}:
            <span> 81460-120</span>
          </Col>
        </Row>
        <Row gutter={24} className="romaneio-cabecalho-row" style={{marginBottom: 10}}>
          <Col span={24}>
            {getMessage("romaneio.cabecalho.condicaoPagamento.label")}:
            <span> 35 dd</span>
          </Col>
        </Row>
      </>
    )
  }

  function renderTabela() {
    function gerarData() {
      return entity.servicos?.map(servico => ({
        ...servico,
        children: servico.produtos,
      }))
    }
    function gerarSumario(pageData){
      function sum(a, b){
        return a + b
      }
      function mudarVolume(){
        if (volume !== entity.volume){
          setPopConfirmVisible(true)
        }
      }
      const total = pageData.map(data => data.children.length).reduce(sum, 0)
      const qntdTotal = pageData.map(data => data.quantidade).reduce(sum, 0)
      const valorTotal = pageData.map(data => data.valorTotal).reduce(sum, 0)

      if(entity.servicos && entity.servicos.length) {
        return (
            <>
              <Table.Summary.Row className="romaneio-sumario">
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2}>
                  {total}
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}>
                  {qntdTotal}
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}>
                  <Popconfirm icon={""}
                              visible={popConfirmVisible}
                              disabled
                              onVisibleChange={ v => setPopConfirmVisible(v) }
                              cancelText={ <FormattedMessage id="comum.nao.label" /> }
                              okText={ <FormattedMessage id="comum.sim.label" /> }
                              title={
                                <FormattedMessage id="romaneio.dados.mudarVolume.label" />
                              }
                              onConfirm={() => {
                                dispatch(mudarRomaneioVolumeRequest(entity, volume))
                              }}
                              onCancel={() => {
                                setVolume(entity.volume)
                              }}
                  >
                    <InputNumber
                        disabled={entity.status !== "ABERTO"}
                        value={volume}
                        onBlur={mudarVolume}
                        min={1}
                        precision={0}
                        onChange={(value) => setVolume(value)}/>
                  </Popconfirm>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}/>
                <Table.Summary.Cell colSpan={1}>
                  {"R$ " + valorTotal.toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
        );
      } else {
        return null
      }
    }

    function configurarTabela() {
      return {
        i18n: "romaneio.dados.tabela.",
        size: "small",
        rowClassName: (record, index) => record.children ? 'romaneio-servico-header' : '',
        expandable: {
          expandedRowKeys: expanded,
          onExpandedRowsChange: (rows) => setExpanded(rows)
        },
        summary: gerarSumario,
        columns: [
          {
            key: 'codigo',
            width: '15%',
          },
          {
            key: 'descricao',
            width: '40%',
          },
          {
            key: 'unidade',
            width: '5%',
          },
          {
            key: 'quantidade',
            width: '5%',
          },
          {
            key: 'volume',
            width: '7%',
          },
          {
            key: 'valorUnitario',
            width: '13%',
            render: (text) => text ? `R$ ${text.toFixed(2)}` : ""
          },
          {
            key: 'valorTotal',
            width: '15%',
            render: (text) => text ? `R$ ${text.toFixed(2)}` : ""
          },
        ],
        data: gerarData(),
      }
    }

    return (
      <>
        <TabelaAnt
          configTable={configurarTabela()}
        />
      </>
    )
  }

  function renderModals() {
    return <>
      <DadosModal
        modalOpen={dadosModalOpen}
        setModalOpen={setDadosModalOpen}
        entity={entity}
        historico={romaneio.historico}
      />
    </>
  }


  return (
    <>
      {renderQuadroInfos()}
      {renderCabecalho()}
      {renderLotes()}
      {renderTabela()}
      {renderModals()}
    </>
  )
}

export default RomaneioForm
