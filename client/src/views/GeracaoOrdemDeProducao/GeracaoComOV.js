import React from "react";
import {Button, Col, Form, Row, Select, Spin, Table} from "antd";
import {InputAnt} from "../../components/form/Input";
import {SelectFilter} from "../../components/form/SelectFilter";
import {useDispatch, useSelector} from "react-redux";
import {
  buscarPorOrdemDeVendaRequest,
  buscarProdutosRequest,
  limparProdutos
} from "../../store/modules/GeracaoOrdemDeProducao/action";
import {getMessage} from "../../components/messages";
import {FormattedMessage} from "react-intl";
import GeracaoOrdemDeProducaoComOVTable from "./GeracaoComOVTable";
import Alert from "react-s-alert"

const GeracaoOrdemDeProducaoComOV = ({show, form}) => {
  const geracaoOrdemDeProducao = useSelector(store => store.geracaoOrdemDeProducao);
  const {listProdutos, loadingProdutos, ordens} = geracaoOrdemDeProducao;
  const dispatch = useDispatch()


  const onSearch = (codigo, descricao) => {
    if ((codigo && codigo.length > 2) || (descricao && descricao.length > 2)) {
      dispatch(buscarProdutosRequest(codigo, descricao))
    }
  }

  const formataListaParaSelect = (list, key, value) => {
    return list.map(l => ({...l, key: l[key], value: l[value]}))
  }

  const handleChangeProduto = (e) => {
    form.setFieldsValue({codigoProduto: e, descricaoProduto: e})
  }

  const buscarPorOrdemDeVenda = () => {
    const ordemDeVenda = form.getFieldValue("ordemDeVenda")
    if (!ordemDeVenda){
      Alert.error(getMessage("geracaoOrdemDeProducao.ov.buscar.error"))
      return;
    }
    const codigoProduto = form.getFieldValue("codigoProduto")

    dispatch(buscarPorOrdemDeVendaRequest(ordemDeVenda, codigoProduto))
    dispatch(limparProdutos())
  }

  return (
    show &&
    <>
      <Row gutter={24}>
        <Col span={6}>
          <InputAnt isRequired nomeAtributo={"ordemDeVenda"} label={getMessage("geracaoOrdemDeProducao.ordemDeVenda.label")}/>
        </Col>
        <Col span={5}>
          <SelectFilter
            ordenar
            hasFormItem
            onChange={handleChangeProduto}
            onSearch={(value => {
              onSearch(value, "")
            })}
            notFoundContent={loadingProdutos ?
              <div style={{textAlign: 'center'}}><Spin size="small"/></div> : null}
            list={formataListaParaSelect(listProdutos, "codigo", "codigo")} nomeAtributo={"codigoProduto"}
            label={getMessage("geracaoOrdemDeProducao.codigoProduto.label")}/>
        </Col>
        <Col span={10}>
          <SelectFilter
            ordenar
            hasFormItem
            onSearch={(value => {
              onSearch("", value)
            })}
            onChange={handleChangeProduto}
            notFoundContent={loadingProdutos ?
              <div style={{textAlign: 'center'}}><Spin size="small"/></div> : null}
            list={formataListaParaSelect(listProdutos, "codigo", "descricao")} nomeAtributo={"descricaoProduto"}
            label={getMessage("geracaoOrdemDeProducao.descricaoProduto.label")}/>
        </Col>
        <Col span={3}>
          <Button style={{marginTop: 30}} size={"large"} onClick={buscarPorOrdemDeVenda} type={"primary"}>
            <FormattedMessage id={"comum.buscar.label"}/>
          </Button>
        </Col>
      </Row>
      <GeracaoOrdemDeProducaoComOVTable/>

    </>
  )
}

export default GeracaoOrdemDeProducaoComOV
