import React, {useEffect, useState} from "react";
import {Modal, Button, Form, Input, Alert, Spin} from "antd";
import {injectIntl} from "react-intl";
import {useSelector} from "react-redux";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {getMessage} from "../../components/messages";
import {AiFillPrinter} from "react-icons/all";
import {SelectFilter} from "../../components/form/SelectFilter";

function ModalCategory({
 visible,
 handleCancel,
 entidade,
 loading,
 onSave,
 intl,
 entity
}) {

  const [form] = Form.useForm();
  const [valueLabel, setValueLabel] = useState("");
  const [agrupamento, setAgrupamento] = useState(null);
  const [quantidade, setQuantidade] = useState(null);
  const [quantidadeMaxima, setQuantidadeMaxima] = useState(null);
  const [justificativa, setJustificativa] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [impressora, setImpressora] = useState("");
  const faturamento = useSelector(state => state.faturamento)
  const {impressoras = []} = faturamento
  const {checagem = []} = faturamento
  const semDados = !loading && !checagem.length
  const comDados = !loading && !!checagem.length
  const tudoInvalido = !loading && !semDados && checagem.every(romaneio => !romaneio.valido)
  const tudoValido = !loading && !semDados && checagem.every(romaneio => romaneio.valido)
  useEffect(() => {
    if (entidade && entidade.statusLote) {
      setValueLabel(entidade.statusLote);
      setAgrupamento(entidade.agrupamento)
      setQuantidade(entidade.quantidade)
      setQuantidadeMaxima(entidade.quantidadeMaxima)
    }
  }, [entidade])
  useEffect(() => {
      if (impressoras.length > 0) {
      const imp = JSON.parse(localStorage.getItem("impressora"))
      form.setFieldsValue({"impressora": imp?.id || imp})
      setImpressora(impressoras.find(impr => impr.id === imp?.id || imp))
    }
  }, [impressoras]);
  function configTable(){
    return {
      i18n: "faturamento.modal.romaneio.tabela.",
      columns: [
        {
          key: "ordemDeProducao",
          width: '20%',
        },
        {
          key: "lote",
          width: '20%',
        },
        {
          key: "codigo",
          width: '20%',
        },
        {
          key: "servico",
          width: '20%',
          render: (text, record) => record.servico ? text : getMessage("comum.nenhum.label")
        },
        {
          key: "valido",
          width: '10%',
          render: (text, record) => record.valido ? <Alert message={getMessage("comum.valido.label")} type="success" showIcon/>
              : <Alert message={getMessage("comum.invalido.label")} type="error" showIcon/>
        },
      ],
      data: checagem,
    };
  }

  function renderModalFechado(){
    return (
      <Modal
        visible={visible}
        title={getMessage(!tudoValido || semDados ? "faturamento.modal.romaneio.naoPossivel.title.label" : "faturamento.modal.romaneio.label")}
        onCancel={handleCancel}
        destroyOnClose={true}
        width={comDados ? 800 : undefined}
        footer={!tudoValido || semDados
          ? [
            <Button type="primary" key="back" onClick={handleCancel}>
              {getMessage("comum.ok.label")}
            </Button>,
          ]
          : [
            <Button key="back" onClick={handleCancel}>
              {getMessage("comum.cancelar.label")}
            </Button>,
            <Button
              key="submit"
              disabled={semDados || tudoInvalido}
              type="primary"
              loading={loading}
              onClick={cadastrar}
            >
              {getMessage("comum.sim.label")}
            </Button>
          ]}
      >
        <Form onFinish={onFinish} layout={"vertical"} form={form}/>
        {semDados && <>
          <Alert message={getMessage("faturamento.modal.romaneio.semDados.label")} type="error" showIcon />
        </>}
        {tudoInvalido && <>
          <Alert message={getMessage("faturamento.modal.romaneio.tudoInvalido.label")} type="error" showIcon />
        </>}
        {comDados && !tudoInvalido && !tudoValido && <>
          <Alert message={getMessage("faturamento.modal.romaneio.peloMenosUmInvalido.label")} type="error" showIcon />
        </>}
        {comDados && <>
          <div style={{marginTop: tudoValido ? 0 : 20}}/>
          <TabelaAnt configTable={configTable()} loading={loading} />
        </>}

      </Modal>
    )
  }

  function renderModalAbertoSemAgrupamento(){
    return (
      <Modal
        visible={visible}
        title={getMessage("faturamento.modal.fechamentoSemAgrupamento.label")}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {getMessage("comum.cancelar.label")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={cadastrar}
          >
            {getMessage("comum.sim.label")}
          </Button>
        ]}
      >
        <Form onFinish={onFinish} layout={"vertical"} form={form}>
          {entidade.impressoesPendentes && <SelectFilter
            placeholder={getMessage("apontamento.selecionarImpressora.label")}
            list={(impressoras || []).map(imp => {
              return {
                key: imp.key,
                value: imp.apelido
              }
            })}
            nomeAtributo={"impressora"}
            hasFormItem
            label={getMessage("faturamento.modal.selecioneImpressora.label")}
            suffixIcon={<AiFillPrinter size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
            onChange={e => salvarImpressora(e)}
          />
          }
        </Form>
      </Modal>
    )
  }

  function renderModalComAgrupamento(){
    return (
      <Modal
        visible={visible}
        title={getMessage("faturamento.modal.fechamentoComAgrupamento.label")}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {getMessage("comum.cancelar.label")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            disabled={entity?.agrupamento && !valueInput}
            onClick={() => getJustificativa(valueInput)}
          >
            {getMessage("comum.sim.label")}
          </Button>
        ]}
      >

        <Form onFinish={onFinish} layout={"vertical"} form={form}>
          {entidade.impressoesPendentes?.length && <SelectFilter
            placeholder={getMessage("apontamento.selecionarImpressora.label")}
            list={(impressoras || []).map(imp => {
              return {
                key: imp.key,
                value: imp.apelido
              }
            })}
            nomeAtributo={"impressora"}
            hasFormItem
            label={getMessage("faturamento.modal.selecioneImpressora.label")}
            suffixIcon={<AiFillPrinter size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
            onChange={e => salvarImpressora(e)}
          />
          }
          <Form.Item>
            <Input.TextArea
              onChange={e => setValueInput(e.target.value)}
              nomeAtributo={"justificativa"}
              isRequired={"true"}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  return (
    valueLabel === "FECHADO" ? renderModalFechado()
      : valueLabel === "ABERTO" && !agrupamento ? renderModalAbertoSemAgrupamento()
      : renderModalComAgrupamento()
  );

  function salvarImpressora(impressora) {
    localStorage.setItem("impressora", JSON.stringify(impressora));
    setImpressora(impressoras.find(impr => impr.id === impressora))
  }


  function getMessage(id) {
    return intl.formatMessage({id});
  }

  function cadastrar() {
    setJustificativa(false)
    form.submit()
  }

  function getJustificativa() {
    setJustificativa(true)
    form.submit()
  }

  function onFinish() {
    onSave({
      statusLote: entidade.statusLote,
      id: entidade.id,
      codigoLote: entidade.codigoLote,
      justificativa: justificativa ? valueInput : null,
      impressora: impressora
    })
  }
}

export default injectIntl((ModalCategory));
