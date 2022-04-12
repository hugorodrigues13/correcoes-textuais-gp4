import React, {useEffect, useState} from "react";
import {PageHeader, Modal, Button, Spin, Tooltip} from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {
  ordensAtrasadasRequest
} from "../../store/modules/AcompanhamentoOrdemProducao/action";
import {useDispatch} from "react-redux";
import {HiOutlineLink} from "react-icons/all";

function ModalOrdensAtrasadas({
                               getMessage,
                               isModalVisible,
                               handleOk,
                               handleCancel,
                               ordensAtrasadas,
                               loadingOrdensAtrasadas,
                               filtrosDashboard
                       }) {

  const [filtros, setFiltros] = useState({
    ordemDeProducao: "",
    codigoProduto: "",
    descricaoProduto: "",
    pedido: "",
    roteiro: "",
    dataPrevisaoFinalizacao: "",
    offset: 0,
    max: 10,
    order: "ASC",
    paginacao: {
      offset: 0,
      max: 10
    },
    ordenacao: {
      sort: "codigoProduto",
      order: "asc"
    }
  })

  const dispatch = useDispatch();

  useEffect(() => {
    if(isModalVisible) {
      getList()
    } else {
      setFiltros({...filtros,
        max: 10,
        offset: 0,
        paginacao: {...paginacao,
          max: 10,
          offset: 0,
        }
      })
    }
  }, [isModalVisible])


  function getoffset (offset, max) {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  }

  function getFiltros () {
    const { ordemDeProducao,
            codigoProduto,
            descricaoProduto,
            pedido,
            roteiro,
            dataPrevisaoFinalizacao,
            } = filtros;
    let { offset, max } = filtros.paginacao;
    offset = getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ordemDeProducao,
      codigoProduto,
      descricaoProduto,
      pedido,
      roteiro,
      dataPrevisaoFinalizacao,
      offset,
      max,
      sort,
      order,
      ...filtrosDashboard,
    };
  }

  function getList () {
    const filtros = getFiltros();
    dispatch(ordensAtrasadasRequest(filtros));
  }

  function paginacao (offs, sort, order) {
    filtros.paginacao.offset = offs
    filtros.ordenacao.sort = sort
    filtros.ordenacao.order = order === "ascend" ? "asc" : order === "descend" ? "desc" : ""

    getList();
  }

  function atualizaRegistrosPorPagina (quantidadeRegistros) {console.log(quantidadeRegistros)
    filtros.paginacao.max = quantidadeRegistros;
    filtros.paginacao.offset = 0;
  }

  const configTable = {
    i18n: "dashboardProgramacao.tabela.",
    columns: [
      {
        key: "ordemDeProducao",
        isSorteable: false,
        defaultSort: filtros.ordenacao.sort === "numero"
      },
      {
        key: 'codigoProduto',
        isSorteable: true,
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
        key: "dataPrevisaoFinalizacao",
        isSorteable: true,
        defaultSort: filtros.ordenacao.sort === "dataPrevisaoFinalizacao"
      },
    ],
    data: ((ordensAtrasadas && ordensAtrasadas.entities) || []).map(value => {
      if(!value.hasOwnProperty("roteiro")){
        return {...value, roteiro: "00"}
      } else {
        return value
      }
    }),
    paginacao: {
      total: (ordensAtrasadas && ordensAtrasadas.total) || 0,
      max: filtros.paginacao.max,
      offset: filtros.paginacao.offset,
      acao: paginacao,
      atualizaRegistrosPorPagina: atualizaRegistrosPorPagina,
    }
  }

  return (
    <Modal
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={<Button key="submit" type="primary" onClick={handleOk}>Fechar</Button>}
      width={1000} >
      <PageHeader
        title={<FormattedMessage id="dashboard.title.ordensDeProducaoAtrasadas" />}
      />
      <br />
      <TabelaAnt configTable={configTable} loading={loadingOrdensAtrasadas} />
    </Modal>
  );

}

export default injectIntl((ModalOrdensAtrasadas));
