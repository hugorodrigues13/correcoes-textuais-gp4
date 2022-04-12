import React, { useEffect, useState } from "react";
import {Button, Col, Form, Input, Popover, Row, Spin} from "antd";
import { SelectFilter } from "../../components/form/SelectFilter";
import {
  buscarFornecedoresListasRoteirosRequest,
  buscarProdutosRequest, gerarOrdemDeProducaoSetEntity
} from "../../store/modules/GeracaoOrdemDeProducao/action";
import { useDispatch, useSelector } from "react-redux";
import { InputNumberAnt } from "../../components/form/InputNumber";
import { DatePickerAnt } from "../../components/form/DatePicker";
import { SelectAnt } from "../../components/form/SelectAnt";
import { getMessage } from "../../components/messages";
import dayjs from "dayjs";
import {InputAnt} from "../../components/form/Input";
import {AiFillFileAdd} from "react-icons/ai";
import ImportarOrdensButton from "./ImportarOrdensButton";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

const GeracaoOrdemDeProducaoSemOV = ({ show, form }) => {
  const geracaoOrdemDeProducao = useSelector(store => store.geracaoOrdemDeProducao);
  const { entityInstance, listProdutos, loadingProdutos, listFornecedoresListasRoteiros } = geracaoOrdemDeProducao;
  const [fornecedoresListasRoteirosFiltrada, setFornecedoresListasRoteirosFiltrada] = useState([])

  useEffect(() => {
    form.setFieldsValue({
      codigoProduto:  entityInstance.codigoProduto,
      descricaoProduto:  entityInstance.descricaoProduto,
      quantidade: entityInstance.quantidade,
      dataPrevisaoFinalizacao: entityInstance.dataPrevisaoFinalizacao,
      fornecedor: entityInstance.fornecedor,
      lista: entityInstance.lista,
      roteiro: entityInstance.roteiro,
      justificativa: entityInstance.justificativa,
    });
  }, [entityInstance]);

 const dispatch = useDispatch()

  useEffect(() => {
      const values = ['fornecedor', 'lista', 'roteiro']
      let newEntity = entityInstance
      values.forEach(val => {
          const possibleValues = [...new Set(listFornecedoresListasRoteiros.map(flr => flr[val]))]
          if(possibleValues.length === 1) {
              newEntity = {...newEntity, [val]: possibleValues[0]}
          }
      })

      setEntityInstance(newEntity)

      setFornecedoresListasRoteirosFiltrada(listFornecedoresListasRoteiros)
  }, [listFornecedoresListasRoteiros])

  const onSearch = (codigo, descricao) => {
    if ((codigo && codigo.length > 2) || (descricao && descricao.length > 2)) {
      dispatch(buscarProdutosRequest(codigo, descricao))
    }
  }

  const formataListaParaSelect = (list, key, value) => {
    return list.map(l => ({ ...l, key: l[key], value: l[value] }))
  }

  const formataListaParaSelectFornecedor = () => {
    const allRoteiros = [...new Set(fornecedoresListasRoteirosFiltrada.map(l => l.fornecedor))]
    return allRoteiros.map(r => ({key: r, value: fornecedoresListasRoteirosFiltrada.find(l => l.fornecedor === r).nomeFornecedor}))
  }

  const formataListaParaSelectRoteiro = () => {
    const allRoteiros = [...new Set(fornecedoresListasRoteirosFiltrada.map(l => l.roteiro))]
    return allRoteiros.map(r => ({key: r, value: r}))
  }

  const formataListaParaSelectLista = () => {
    const allRoteiros = [...new Set(fornecedoresListasRoteirosFiltrada.map(l => l.lista))]
    return allRoteiros.map(r => ({key: r, value: r}))
  }

  const handleChangeProduto = (e) => {
    setEntityInstance({...entityInstance, codigoProduto: e, descricaoProduto: e})
    if (e && e.length > 7) {
      dispatch(buscarFornecedoresListasRoteirosRequest(e))
    }
  }

  const handleChangeField = (name, value) => {
     setEntityInstance({...entityInstance, [name]: value})
  }

  function disabledDate(current) {
    return current < dayjs().startOf("day");
  }

  function onChangeFornecedorListaRoteiro(value, type) {
      const otherValues = ['fornecedor', 'lista', 'roteiro'].filter(val => val !== type)
       if(value) {

           const all = fornecedoresListasRoteirosFiltrada;
           const listaFiltrada = all.filter(flr => flr[type] === value)
           let newEntity = {...entityInstance, [type]: value}

           otherValues.forEach(val => {
               const possibleValues = [...new Set(listaFiltrada.map(flr => flr[val]))]
               if(possibleValues.length === 1) {
                   newEntity = {...newEntity, [val]: possibleValues[0]}
               }
           })

           setEntityInstance(newEntity)
           setFornecedoresListasRoteirosFiltrada(listaFiltrada)
       } else {
           const values = otherValues.filter(val => entityInstance[val])
           const all = listFornecedoresListasRoteiros;

           const listaFiltrada = all.filter(flr => {
               return !values.length || values.some(val => !entityInstance[val] || flr[val] === entityInstance[val])
           })

           setEntityInstance({...entityInstance, [type]: value})
           setFornecedoresListasRoteirosFiltrada(listaFiltrada)
       }
  }

  const setEntityInstance = (entity) => {
    dispatch(gerarOrdemDeProducaoSetEntity(entity))
  }

  function configTable() {
    const entities = [...listFornecedoresListasRoteiros].sort((a, b) => a.nomeFornecedor.toLowerCase() > b.nomeFornecedor.toLowerCase() ? 1 : -1)
    return {
      i18n: "geracaoOrdemDeProducao.semOV.tabela.",
      columns: [
        {
          key: 'nomeFornecedor',
        },
        {
          key: 'roteiro',
          render: (text, record) => `${record.roteiro} - ${record.detalhesRoteiro}`
        },
        {
          key: 'lista',
          render: (text, record) => `${record.lista} - ${record.detalhesLista}`
        },
      ],
      data: entities,
    }
  };

  return (
    show &&
    <>
      <Row gutter={24}>
        {/* CODIGO DO PRODUTO */}
        <Col span={4}>
          <SelectFilter
            ordenar
            hasFormItem
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            onChange={handleChangeProduto}
            onSearch={(value => {
              onSearch(value, "")
            })}
            notFoundContent={
              loadingProdutos ?
                <div style={{ textAlign: 'center' }}><Spin size="small" /></div> : null
            }
            list={formataListaParaSelect(listProdutos, "codigo", "codigo")}
            nomeAtributo={"codigoProduto"}
            label={getMessage("geracaoOrdemDeProducao.codigoProduto.label")}
          />
        </Col>
        {/* DESCRIÇÃO DO PRODUTO */}
        <Col span={9}>
          <SelectFilter
            ordenar
            hasFormItem
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            onSearch={(value => {
              onSearch("", value)
            })}
            onChange={handleChangeProduto}
            notFoundContent={
              loadingProdutos ?
                <div style={{ textAlign: 'center' }}><Spin size="small" /></div> : null
            }
            list={formataListaParaSelect(listProdutos, "codigo", "descricao")}
            nomeAtributo={"descricaoProduto"}
            label={getMessage("geracaoOrdemDeProducao.descricaoProduto.label")}
          />
        </Col>
        {/* QUANTIDADE */}
        <Col span={4}>
          <InputNumberAnt
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            nomeAtributo={"quantidade"}
            onChange={(e) => handleChangeField("quantidade", e)}
            label={getMessage("geracaoOrdemDeProducao.quantidade.label")}
            min={1} />
        </Col>
        {/* DATA DE PREVISÃO DE FINALIZAÇÃO */}
        <Col span={7}>
          <DatePickerAnt
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            style={{ width: '100%' }}
            nomeAtributo={"dataPrevisaoFinalizacao"}
            label={getMessage("geracaoOrdemDeProducao.dataPrevisaoFinalizacao.label")}
            onChange={(e) => handleChangeField("dataPrevisaoFinalizacao", e)}
            disabledDate={disabledDate} />
        </Col>
      </Row>
      <Row gutter={24}>
        {/* FORNECEDOR */}
        <Col span={14}>
          <SelectAnt
            allowClear
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            onChange={e => onChangeFornecedorListaRoteiro(e, "fornecedor")}
            nomeAtributo={"fornecedor"}
            list={formataListaParaSelectFornecedor()}
            label={getMessage("geracaoOrdemDeProducao.fornecedor.label")} />
        </Col>
        {/* ROTEIRO  */}
        <Col span={5}>
          <SelectAnt
            allowClear
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            onChange={e => onChangeFornecedorListaRoteiro(e, "roteiro")}
            nomeAtributo={"roteiro"}
            list={formataListaParaSelectRoteiro()}
            label={getMessage("geracaoOrdemDeProducao.roteiro.label")} />
        </Col>
        {/* LISTA */}
        <Col span={5}>
          <SelectAnt
            allowClear
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            onChange={e => onChangeFornecedorListaRoteiro(e, "lista")}
            nomeAtributo={"lista"}
            list={formataListaParaSelectLista()}
            label={getMessage("geracaoOrdemDeProducao.lista.label")} />
        </Col>
      </Row>
      <Row gutter={24}>
        {/* JUSTIFICATIVA  */}
        <Col span={24}>
          <Form.Item
            name="justificativa"
            label={getMessage("geracaoOrdemDeProducao.justificativa.label")}
          >
            <Input.TextArea
              maxLength={255}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
        <Row gutter={24}>
            <Col span={24}>
                <TabelaAnt configTable={configTable()}/>
            </Col>
        </Row>
    </>
  )
}

export default GeracaoOrdemDeProducaoSemOV
