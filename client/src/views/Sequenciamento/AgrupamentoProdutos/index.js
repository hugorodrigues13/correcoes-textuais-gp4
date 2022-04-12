import React, {useEffect, useState} from 'react'
import {Button, Collapse, Dropdown, Input, Menu, Tooltip} from "antd";
import Produto from "../Produto";
import {getMessage} from "../../../components/messages";
import { SettingOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import dayjs from "dayjs"
import moment from "moment";
import {BsTrash2} from "react-icons/bs";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";

export default function AgrupamentoProdutos({produtos, isProdutosSemGrupo, grupoSelecionado, blur, setCriando}) {
  const { Panel } = Collapse;
  const [produtosFiltrados, setProdutosFiltrados] = useState([])
  const [agrupamento, setAgrupamento] = useState("dataPrometida")
  const { loadingPedidos } = useSelector(store => store.sequenciamento)
  const [searchValue, setSearchValue] = useState("")
  const [oldGrupo, setOldGrupo] = useState(0)

  useEffect(() => {
    if (oldGrupo !== grupoSelecionado){
      setProdutosFiltrados(produtos)
      setSearchValue("")
      setOldGrupo(grupoSelecionado)
    } else {
      filtraProdutos(searchValue)
    }
  }, [produtos])

  function hasProdutos() {
    return produtos && produtos.length > 0
  }

  function getProdutosAgrupados(listProdutos, agrupamento) {

    listProdutos = listProdutos.map(item=>{
      return({
          ...item,
          dataPrometida: item.dataPrometida === null ? "Sem data prometida" : dayjs(item.dataPrometida).format('DD/MM/YYYY'),
          codigoProduto: item.codigoProduto === null ? "Sem codigo do produto" : item.codigoProduto,
          pedido: item.pedido === null ? "Sem pedido" : item.pedido,
      })
    });

    const grouped = listProdutos.reduce(function(acc, curr) {
      (acc[curr[agrupamento]] = acc[curr[agrupamento]] || []).push(curr);
      return acc;
    }, {});

    return Object.keys(grouped).map(g => ({key: g, value: grouped[g]?.sort((prodA, prodB) => prodA.codigoProduto - prodB.codigoProduto)}))
  }

  function sumQtde(list) {
    return list.reduce((a, b) => a + (b['quantidade'] || 0), 0)
  }

  function filtraProdutos(value) {
    setProdutosFiltrados(
      produtos.filter(
        p => (p.codigoProduto && p.codigoProduto.toUpperCase().includes(value.toUpperCase())) ||
          (p.dataPrometida && moment(p.dataPrometida, "YYYY-MM-DD").format("DD/MM/YYYY").includes(value.toUpperCase())) ||
          (p.ordemDeProducao && p.ordemDeProducao.toUpperCase().includes(value.toUpperCase())) ||
          (p.descricaoProduto && p.descricaoProduto.toUpperCase().includes(value.toUpperCase())) ||
          (p.pedido && p.pedido.toUpperCase().includes(value.toUpperCase()))
      )
    )

    setSearchValue(value)
  }

  function handleMenuClick(e) {
    setAgrupamento(e.key)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="dataPrometida">
        {getMessage("sequenciamento.dataPrometida.label")}
      </Menu.Item>
      <Menu.Item key="pedido">
        {getMessage("sequenciamento.pedido.label")}
      </Menu.Item>
      <Menu.Item key="codigoProduto">
        {getMessage("sequenciamento.codigoProduto.label")}
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="agrupamento-produtos-container" style={{filter: blur ? 'blur(2px)' : ''}}>
      <div className="agrupamento-produtos">
        <div style={{ marginBottom: 16 }}>
          <Input.Group compact>
            <Input
              className={"input-busca-produtos"}
              placeholder={getMessage("comum.pesquisar.label")}
              value={searchValue}
              onChange={(e) => filtraProdutos(e?.target?.value)}
            />
            <Tooltip title="Agrupamento">
              <Dropdown placement={"bottomRight"} overlay={menu}>
                <Button className={"button-agrupamento"} type={"ghost"}>
                  <SettingOutlined />
                </Button>
              </Dropdown>
            </Tooltip>
          </Input.Group>

        </div>

        <div className={"lista-produtos"}>
        {hasProdutos() ? <Collapse bordered>
          {
            getProdutosAgrupados(produtosFiltrados, agrupamento).map((produtoAgrupado, idx) => {
              return <Panel className="custom-panel-products" key={idx}
                            header={`${produtoAgrupado.key} (${sumQtde(produtoAgrupado.value)})`}>
                {
                  produtoAgrupado.value.map((prod, idx) => {
                    return <Produto canDrag={!isProdutosSemGrupo} produto={prod} key={idx} setCriando={setCriando} />
                  })
                }
              </Panel>
            })
          }
        </Collapse>
          : <div className="alerta-sem-produtos">
            {getMessage(`sequenciamento.agrupamentoProdutos.${!loadingPedidos
              ? "emptyProdutos" : "buscandoProdutos"}.${isProdutosSemGrupo ? 'semGrupo': 'grupo'}`)}
          </div>}
        </div>
      </div>
    </div>
  )
}
