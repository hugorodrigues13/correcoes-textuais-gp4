import React, {useEffect, useState} from "react";
import {PageHeader, Modal, Button, Spin, Tooltip} from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import TabelaAnt from "../../../components/tabelaAnt/Tabela";
import Filter from "../../../components/filter/Filter";
import ModalAssociarProdutos from "../ModalAssociarProdutos";
import {getOrdensDeProducaoProdutosSemGrupoAssociadoRequest} from "../../../store/modules/Sequenciamento/action";
import {useDispatch} from "react-redux";
import {HiOutlineLink} from "react-icons/all";

function ModalProdutosSemGrupo({
                               getMessage,
                               isModalVisible,
                               handleOk,
                               handleCancel,
                               ordensSemGrupo,
                               LoadingOrdensSemGrupo,
                               listaGrupos,
                               totalOrdensSemGrupoFiltradas
                       }) {

  const dispatch = useDispatch();
  const [ produtoSemGrupoSelecionado, setProdutoSemGrupoSelecionado ] = useState(null);
  const [ mostrarModalGruposDeLinhas, setMostrarModalGruposDeLinhas ] = useState(false);
  const [filtros, setFiltros] = useState({
    ordemDeProducao: "",
    codigoProduto: "",
    offset: 0,
    max: 10,
    order: "ASC",
    paginacao: {
      offset: 0,
      max: 10
    },
    ordenacao: {
      sort: "ordemDeProducao",
      order: "asc"
    }
  })

  useEffect(() => {
    if(isModalVisible) {
      dispatch(getOrdensDeProducaoProdutosSemGrupoAssociadoRequest(filtros))
    }
  }, [isModalVisible])


  function getoffset (offset, max) {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  }

  function getFiltros () {
    const { codigoProduto, ordemDeProducao } = filtros;
    let { offset, max } = filtros.paginacao;
    offset = getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ordemDeProducao,
      codigoProduto,
      offset,
      max,
      sort,
      order
    };
  }

  function getList () {
    const filtros = getFiltros();
    dispatch(getOrdensDeProducaoProdutosSemGrupoAssociadoRequest(filtros));
  }

  function paginacao (offs, sort, order) {
    filtros.paginacao.offset = offs,
    filtros.ordenacao.sort = sort,
    filtros.ordenacao.order = order === "ascend" ? "asc" : order === "descend" ? "desc" : ""
    getList();
  }

  function atualizaRegistrosPorPagina (quantidadeRegistros) {
    filtros.paginacao.max = quantidadeRegistros;
    filtros.paginacao.offset = 0;
  }

  function handlePesquisar (values) {
    filtros.ordemDeProducao = values.ordemDeProducao !== undefined ? values.ordemDeProducao : ""
    filtros.codigoProduto = values.codigoProduto !== undefined ? values.codigoProduto : ""
    getList();
  }

  function mapPropsToFields () {
    return {
      ordemDeProducao: filtros ? filtros.ordemDeProducao : "",
      codigoProduto: filtros ? filtros.codigoProduto : ""
    }
  }

  const filterComp = {
    labelCol:{style: {lineHeight:1}},
    margin:{marginTop: '10px'},
    layout: "vertical",
    prefix: "sequenciamento",
    campos: [
      { nome: "ordemDeProducao", tipo: "text" },
      { nome: "codigoProduto", tipo: "text" }
    ]
  }

  const configTable = {
    i18n: "sequenciamento.tabela.",
    columns: [
      {
        key: "ordemDeProducao",
        isSorteable: true,
        defaultSort: filtros.ordenacao.sort === "ordemDeProducao"
      },
      {
        key: 'codigoProduto',
        isSorteable: false,
        defaultSort: filtros.ordenacao.sort === "codigoProduto"
      },
      {
        key: "descricaoProduto",
        isSorteable: false,
        defaultSort: filtros.ordenacao.sort === "descricaoProduto"
      },
      {
        key: 'pedido',
        isSorteable: false,
        defaultSort: filtros.ordenacao.sort === "pedido"
      },
      {
        key: "roteiro",
        isSorteable: false,
        defaultSort: filtros.ordenacao.sort === "roteiro"
      },
      {
        title: 'Ações',
        dataIndex: '',
        key: 'acoes',
        render: (value, record) => {
            return <Tooltip placement="right"
                     title={getMessage("sequenciamento.produtosNaoAssociados.associarAoGrupoDeLinhas.label")}>
              <a onClick={() => selecionarProdutoSemGrupo(record.codigoProduto, record.roteiro)}><HiOutlineLink/></a>
            </Tooltip>

        },
      },
    ],
    data: (ordensSemGrupo || []).map(value => {
      if(!value.hasOwnProperty("roteiro")){
        return {...value, roteiro: "00"}
      } else {
        return value
      }
    }),
    paginacao: {
      total: totalOrdensSemGrupoFiltradas,
      max: filtros.paginacao.max,
      offset: filtros.paginacao.offset,
      acao: paginacao,
      atualizaRegistrosPorPagina: atualizaRegistrosPorPagina,
    }
  }

  function selecionarProdutoSemGrupo (codigo, roteiro) {
    setProdutoSemGrupoSelecionado({codigo, roteiro})
    setMostrarModalGruposDeLinhas(true)
  }

  function handleCloseModal () {
    setProdutoSemGrupoSelecionado(null)
    setMostrarModalGruposDeLinhas(false)
  }

  return (
    <Modal
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={<Button key="submit" type="primary" onClick={handleOk}>Fechar</Button>}
      width={1000} >
      <PageHeader
        title={<FormattedMessage id="sequenciamento.title.ordensDeProducao" />}
      />
      <Filter
        filterComp={filterComp}
        filtros={filtros}
        handlePesquisar={handlePesquisar}
        mapPropsToFields={mapPropsToFields}
      />
      <br />
      <TabelaAnt configTable={configTable} loading={LoadingOrdensSemGrupo} />
      <ModalAssociarProdutos
        getMessage={getMessage}
        listaGrupos={listaGrupos}
        filtros={filtros}
        produtoSemGrupoSelecionado={produtoSemGrupoSelecionado}
        handleCloseModal={handleCloseModal}
        showModal={mostrarModalGruposDeLinhas}
      />
    </Modal>
  );

}

export default injectIntl((ModalProdutosSemGrupo));
