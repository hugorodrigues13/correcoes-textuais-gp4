import {Badge, Button, Col, Popover, Tooltip} from "antd";
import {getMessage} from "../../../components/messages";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {buscarOrdensGrupoRequest} from "../../../store/modules/Sequenciamento/action";
import {ClearOutlined, MinusOutlined, SearchOutlined} from "@ant-design/icons";
import OrdenarBotao from "./OrdenarBotao";
import Filter from "../../../components/filter/Filter";

export const Filtro = ({grupoSelecionado, ordensDeFabricacao, listStatusOrdemFabricacao}) => {
  const dispatch = useDispatch()
  const [quantFiltrosPesquisados, setQuantFiltrosPesquisados] = useState(0)
  const [flagPesquisar, setFlagPesquisar] = useState(false)

  const [filtros, setFiltros] = useState({
    codigoProduto: "",
    ordemProducao: "",
    ordemFabricacao: "",
    status: [],
    materiaPrima: "",
  })

  useEffect(() => {
    const quantFiltros = Object.values(filtros).filter(item => item !== undefined && item !== null && item !== "" && item.length > 0)
    setQuantFiltrosPesquisados(quantFiltros.length)
  },[filtros])

  const limparPesquisa = () => {
    setFiltros({ codigoProduto: "",
      ordemProducao: "",
      ordemFabricacao: "",
      status: [],
      materiaPrima: ""
    })
    dispatch(buscarOrdensGrupoRequest( grupoSelecionado, {codigoProduto: "",ordemProducao: "",ordemFabricacao: "",status: [],materiaPrima: ""}))
  }

  function filterSequenciamento() {
    return(<div style={{width: "70vw"}}>
      <Filter
        filterComp={filterComp}
        filtros={filtros}
        handlePesquisar={handlePesquisar}
        data={{ listStatusOrdemFabricacao: (listStatusOrdemFabricacao || []).map(value => {return value}) }}
        mapPropsToFields={filtros}
      />
    </div>)
  }

  function renderLabel(status) {
    return status ? getMessage(`ordemFabricacao.filtro.status.${status}.label`) : null;
  }

  const filterComp = {
    labelCol: {style: {lineHeight: 1}},
    margin: {marginTop: '10px'},
    layout: "vertical",
    prefix: "sequenciamento",
    campos: [
      {nome: "codigoProduto", tipo: "text", maxLength: "100", allowClear: true},
      {nome: "ordemProducao", tipo: "text", maxLength: "100", allowClear: true},
      {nome: "ordemFabricacao", tipo: "text", maxLength: "100", allowClear: true},
      {nome: "status", tipo: "select", seletor: "listStatusOrdemFabricacao", maxLength: "100", tratamento: false, useMessage: false, tratarFilter: true, renderLabel: renderLabel, props: {mode: 'multiple'}},
      {nome: "materiaPrima", tipo: "text", maxLength: "100", allowClear: true},
    ]
  }

  const handlePesquisar = async values => {
    setFiltros({...values, status: values.status || []})
    dispatch(buscarOrdensGrupoRequest(grupoSelecionado, values))
    setFlagPesquisar(false)
  };


  return (
    <div className='icones-sequenciamento'>
      <div className='div-icone-sequenciamento'>
      <div style={{position: "absolute", top: "10px", right: "10px"}}>
        <Popover visible={flagPesquisar} content={filterSequenciamento} trigger="click">
          <Badge count={quantFiltrosPesquisados}>
            {!flagPesquisar ? <SearchOutlined className={"icon-area-sequenciamento"} onClick={() => {setFlagPesquisar(!flagPesquisar)}}/> :
              <MinusOutlined className={"icon-area-sequenciamento"} onClick={() => {setFlagPesquisar(!flagPesquisar)}} />}
          </Badge>
        </Popover>
      </div>
      <div style={{position: "absolute", top: quantFiltrosPesquisados > 0 ? "53px" : "40px", right: "10px"}}>
        <OrdenarBotao grupoSelecionado={grupoSelecionado}/>
      </div>
      {quantFiltrosPesquisados > 0 &&
      <div style={{position: "absolute", top: ordensDeFabricacao.length > 0 ? "30px" : "35px", right: "10px"}} >
        <Tooltip title={getMessage("sequenciamento.limpar.tooltip.label")}>
          <ClearOutlined className={"icon-area-sequenciamento"} onClick={(e) => limparPesquisa(e)} />
        </Tooltip>
      </div>
      }
      </div>
    </div>
  )
}
