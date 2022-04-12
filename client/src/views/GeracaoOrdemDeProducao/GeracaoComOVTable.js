import React, {useEffect, useState} from "react";
import {DatePicker, Input, Modal, Select, Table, Tag, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
  selecionarDataRequest, selecionarJustificativaRequest,
  selecionarListaRoteiroRequest,
  selecionarOrdensRequest
} from "../../store/modules/GeracaoOrdemDeProducao/action";
import {getMessage} from "../../components/messages";
import {ordenaListaSelect} from "../../utils/formatador";
import {unique} from "../../utils/utils";
import moment from "moment";
import {disabledDate} from "../../components/utils";

const GeracaoOrdemDeProducaoComOVTable = () => {
  const geracaoOrdemDeProducao = useSelector(store => store.geracaoOrdemDeProducao);
  const {ordens} = geracaoOrdemDeProducao;
  const dispatch = useDispatch();
  const [justificativaModal, setJustificativaModal] = useState(false)
  const [justificativaRecord, setJustificativaRecord] = useState({})
  const {errosGeracaoComOV} = useSelector(store => store.geracaoOrdemDeProducao);

  function formataListaParaSelectRoteiroLista(record, propriedade) {
    const fornecedoresListasRoteiros = record.fornecedoresListasRoteirosFiltrado
    if (!fornecedoresListasRoteiros) return []
    return unique(fornecedoresListasRoteiros.map(l => ({
      key: l[propriedade],
      value: l[propriedade],
      fornecedor: l.nomeFornecedor,
      fornecedorId: l.fornecedor
    })), "key")
  }

  function selecionarRow(record) {
    if (!geracaoOrdemDeProducao.ordensSelecionadas.some(o => o.codigoProduto === record.codigoProduto)) {
      const selectedRows = [...geracaoOrdemDeProducao.ordensSelecionadas]
      const selectedRowKeys = [...geracaoOrdemDeProducao.ordensSelecionadasIndexs]
      selectedRows.push(record)
      selectedRowKeys.push(geracaoOrdemDeProducao.ordens.findIndex(o => o.codigoProduto === record.codigoProduto))
      dispatch(selecionarOrdensRequest(selectedRows, selectedRowKeys))
    }
  }

  function aoMudarListaRoteiro(value, option, propriedade, record) {
    selecionarRow(record)
    if (propriedade === 'lista') {
      dispatch(selecionarListaRoteiroRequest(record, value, null, option?.prop, propriedade))
    } else {
      dispatch(selecionarListaRoteiroRequest(record, null, value, null, propriedade))
    }
  }

  function aoMudarData(data, record) {
    selecionarRow(record)
    dispatch(selecionarDataRequest(record, data ? data.format("DD/MM/YYYY") : null))
  }

  function aoMudarJustificativa(justificativa, record) {
    selecionarRow(record)
    dispatch(selecionarJustificativaRequest(record, justificativa))
    setJustificativaRecord({...justificativaRecord, justificativa: justificativa})
  }

  function renderSelect(record, propriedade) {
    return (
      <Select
        allowClear
        dropdownAlign={{
          points: ['tr', 'br']
        }}
        dropdownMatchSelectWidth={false}
        style={{width: '100%'}}
        optionLabelProp="label"
        onChange={(value, option) => aoMudarListaRoteiro(value, option, propriedade, record)}
        value={record[propriedade]}
      >
        {ordenaListaSelect(formataListaParaSelectRoteiroLista(record, propriedade))
          .map(registro => (
            <Select.Option
              key={registro.key}
              value={registro.key}
              label={registro.key}
              prop={registro.fornecedorId}
            >
              {registro.value + (propriedade === "lista" ? ` - ${registro.fornecedor}` : "")}
            </Select.Option>
          ))}
      </Select>
    )
  }

  function renderDatePicker(record) {
    return (
      <DatePicker
        style={{width: '100%'}}
        format="DD/MM/YYYY"
        disabledDate={disabledDate}
        onChange={date => aoMudarData(date, record)}
        value={record.dataFinalizacao ? moment(record.dataFinalizacao, "DD/MM/YYYY") : null}
      />
    )
  }

  function renderInput(record) {
    return (
      <Input
        style={{width: '100%'}}
        value={record.justificativa}
        onFocus={(e) => {
          setJustificativaRecord({...record})
          setJustificativaModal(true)
          e.target.blur()
        }}
      />
    )
  }

  const produtosOVsConfigTable = {
    pagination: false,
    rowSelection: {
      selectedRowKeys: geracaoOrdemDeProducao.ordensSelecionadasIndexs,
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch(selecionarOrdensRequest(selectedRows, selectedRowKeys))
      },
      getCheckboxProps: record => ({
        name: record.codigo,
      }),
    },
    scroll: {y: 300},
    columns: [
      {
        key: 'numero',
        dataIndex: 'numero',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.numero.label"),
        width: "12%"
      },
      {
        key: 'codigoProduto',
        dataIndex: 'codigoProduto',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.codigoProduto.label"),
        width: "15%"
      },
      {
        key: 'descricaoProduto',
        dataIndex: 'descricaoProduto',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.descricaoProduto.label"),
        width: "25%"
      },
      {
        key: 'quantidade',
        dataIndex: 'quantidade',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.quantidade.label"),
        width: "15%"
      },
      {
        key: 'dataFinalizacao',
        dataIndex: 'dataFinalizacao',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.dataFinalizacao.label"),
        width: "15%",
        render: (text, record) => renderDatePicker(record)
      },
      {
        key: 'justificativa',
        dataIndex: 'justificativa',
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.justificativa.label"),
        width: "15%",
        render: (text, record) => renderInput(record)
      },
      {
        key: "roteiro",
        dataIndex: "roteiro",
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.roteiro.label"),
        width: "15%",
        render: (text, record) => renderSelect(record, "roteiro")
      },
      {
        key: "lista",
        dataIndex: "lista",
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.lista.label"),
        width: "15%",
        render: (text, record) => renderSelect(record, "lista")
      },
      {
        key: "status",
        title: getMessage("geracaoOrdemDeProducao.ov.tabela.status.label"),
        width: "12%",
        render: (record) => {
          let listaFiltrada = errosGeracaoComOV?.filter((item) => item.index === record.key);
          let message;
          if (listaFiltrada?.length) {
            if (listaFiltrada[0].messages !== "successo") {
              message = listaFiltrada.map((item) => <li>{item.message}</li>);
            }
          }
          return (
            <>
              {listaFiltrada?.length ?
              <>
                {listaFiltrada[0].message !== "sucesso" ?
                  <Tooltip title={message ? message : ""}>
                    <Tag color={"red"}>Erro</Tag>
                  </Tooltip> : <Tag color={"green"}>Sucesso</Tag>}
              </> : null}
            </>
          )
        },
      },
    ],
    dataSource: (ordens || []).map((o, i) => ({...o, key: i}))
  }

  function renderJustificativaModal(){
    return (
      <Modal
        visible={justificativaModal}
        onCancel={() => setJustificativaModal(false)}
        footer={null}
        title={getMessage("geracaoOrdemDeProducao.justificativa.label")}
      >
        <Input.TextArea
          onChange={e => aoMudarJustificativa(e.target.value, justificativaRecord)}
          value={justificativaRecord.justificativa}
          maxLength={255}
          showCount
        />
      </Modal>
    )
  }

  return (
    <>
      {
        ordens.length ? <Table {...produtosOVsConfigTable} /> : null
      }
      {renderJustificativaModal()}
    </>
  )
}

export default GeracaoOrdemDeProducaoComOVTable
