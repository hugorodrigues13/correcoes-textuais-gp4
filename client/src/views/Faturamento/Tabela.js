import { Button } from "antd";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import React, { useEffect, useState } from "react";
import {CLIENT_URL} from "../../config";
import CaixasModal from "./CaixasModal";
import {useDispatch, useSelector} from "react-redux";
import {getCaixasFaturamentoRequest} from "../../store/modules/Faturamento/action";

export default function Tabela ({filtros,
                                  lotes,
                                  total,
                                  acoes,
                                  enviarVariosLotesParaRomaneio,
                                  loading,
                                  filtro,
                                  desativarRomaneio,
                                  getMessage,
                                  abrirLote,
                                  concluirOPsVariosLotes}) {

  const dispatch = useDispatch()
  const { caixas } = useSelector(store => store.faturamento)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [copyLotes, setCopyLotes] = useState([])
  const [caixaModalVisible, setCaixaModalVisible] = useState(false)
  const [caixaModalLote, setCaixaModalLote] = useState({})

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, f) => onSelectChange(selectedRowKeys, f),
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRowKeys(selectedRows.map(value => {return value.id}))
    },
    getCheckboxProps: (record) => ({
      disabled: record.statusLote === 'ABERTO',
    }),
  };

  useEffect(() => {
    setCopyLotes(lotes.map((lote) => {
      return ({
        key: lote.id,
        id: lote.id,
        codigoProduto: lote.codigoProduto,
        descricaoProduto: lote.descricaoProduto,
        local: lote.grupoLinhaProducao,
        agrupamento: lote.agrupamento,
        quantidade: lote.quantidade,
        quantidadePorCaixa: lote.quantidadePorCaixa,
        quantidadeMaxima: lote.quantidadeMaxima,
        codigoLote: lote.codigoLote,
        statusLote: lote.statusLote,
        dataFechamento: lote.dataFechamento,
        impressoesPendentes: lote.impressoesPendentes,
        foiAgrupado: lote.foiAgrupado,
        ordemFabricacao: lote.ordemFabricacao,
      })
    }))
  },[lotes])

  const configTable = {
     i18n: "faturamento.tabela.",
     rowSelection: rowSelection,
     columns: [
       {
         key: "codigoLote",
         isSorteable: false,
         defaultSort: filtros.ordenacao.sort === "codigoLote"
       },
       {
         key: "codigoProduto",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "codigoProduto",
         width: '12%'
       },
       {
         key: "descricaoProduto",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "descricaoProduto"
       },
       {
         key: "local",
         isSorteable: false,
         defaultSort: filtros.ordenacao.sort === "local"
       },
       {
         key: "ordemFabricacao",
         isSorteable: false,
         defaultSort: filtros.ordenacao.sort === "ordemFabricacao"
       },
       {
         key: "agrupamento",
         isSorteable: false,
         defaultSort: filtros.ordenacao.sort === "agrupamento",
         render: (value) => {
           return value ? getMessage("comum.sim.label") : getMessage("comum.nao.label")
         }
       },
       {
         key: "quantidade",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "quantidade"
       },
       {
         key: "quantidadeMaxima",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "quantidadeMaxima"
       },
       {
         key: "quantidadePorCaixa",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "quantidadePorCaixa"
       },
       {
         key: "dataFechamento",
         isSorteable: true,
         defaultSort: filtros.ordenacao.sort === "dataFechamento"
       },
     ],
     data: copyLotes,
     acoes: {
       actionLote: acoes,
       caixas: abrirCaixasModal,
       caixasProps: (lote) => ({
         style: !lote.quantidadePorCaixa ? {display: 'none'} : {},
       }),
       desativarRomaneio,
       abrirLote: abrirLote,
       seriais: irParaSeriais,
     },
     paginacao: {
       total,
       max: filtros.paginacao.max,
       offset: filtros.paginacao.offset,
       acao: filtro.paginacao,
       atualizaRegistrosPorPagina: filtro.atualizaRegistrosPorPagina
     }
   };

  function irParaSeriais(record){
    return `${CLIENT_URL}/prod/serial?lote=${record.codigoLote}&codigoProduto=${record.codigoProduto}`
  }

  function abrirCaixasModal(lote){
    dispatch(getCaixasFaturamentoRequest(lote.id))
    setCaixaModalVisible(true)
    setCaixaModalLote(lote)
  }

  const onSelectChange = (selectedKey, e) => {
    if(selectedRowKeys.length > selectedKey.length){
      setSelectedRowKeys(selectedKey)
    } else {
      setSelectedRowKeys([...selectedRowKeys, selectedKey[(selectedKey.length-1)]])
    }
  };

  const onClickEnviarVariosLotesParaRomaneio = (selectedRowKeys) => {
    enviarVariosLotesParaRomaneio(selectedRowKeys)
    setSelectedRowKeys([])
  }

  const onClickConcluirOPsVariosLotes = (selectedRowKeys) => {
    concluirOPsVariosLotes(selectedRowKeys)
    setSelectedRowKeys([])
  }

  return (<>
    {selectedRowKeys.length > 0 && (desativarRomaneio ?
      <Button
        type="primary"
        style={{ marginBottom: "15px" }}
        onClick={() => onClickConcluirOPsVariosLotes(selectedRowKeys)}>{getMessage("comum.lote.concluirOP.label")}
      </Button> :
    <Button
      type="primary"
      style={{ marginBottom: "15px" }}
      onClick={() => onClickEnviarVariosLotesParaRomaneio(selectedRowKeys)}>{getMessage("faturamento.romaneio.button")}
    </Button>)}
    <CaixasModal
      visible={caixaModalVisible}
      setVisible={setCaixaModalVisible}
      lote={caixaModalLote}
      caixas={caixas}
      loading={loading}
      getMessage={getMessage}
    />
    <TabelaAnt configTable={configTable} loading={loading} />
  </>)
}
