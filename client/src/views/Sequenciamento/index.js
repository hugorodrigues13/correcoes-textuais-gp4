import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {PageHeader, Table, Button, Spin, Row, Tooltip, Popconfirm, Popover, Modal} from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import {SelectFilter} from "../../components/form/SelectFilter";
import SelectGrupo from './SelectGrupo/index'
import {
  buscaLinhasGrupoRequest,
  buscarOrdensGrupoRequest,
  cancelaDrop,
  hideModalCatalogo,
  salvarRequest,
  setGrupoSelecionado,
  getOrdensDeProducaoProdutosAssociadoGrupoRequest,
  getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest, mudarOrdemRequest,
} from "../../store/modules/Sequenciamento/action"
import {formataListaParaSelect} from "../../utils/formatador";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import "./styles.css"
import SidebarProdutos from "./SidebarProdutos";
import AreaSequenciamento from "./AreaSequenciamento";
import ModalBeforeDrop from "./ModalBeforeDrop";
import ModalCatalogoProduto from "./ModalCatalogoProduto";
import ModalProdutosSemGrupo from "./ModalProdutosSemGrupo";
import dayjs from "dayjs";
import Alert from "react-s-alert";
import {AiFillLock, AiOutlineExclamationCircle} from "react-icons/all";
import ModalDesbloquear from "./ModalDesbloquear";

export default function Sequenciamento({ getMessage,
                                         listaGrupos,
                                         grupoSelecionado,
                                         ordensGrupo,
                                         produtoSelecionado,
                                         linhasGrupo,
                                         codigoOrdemAnterior,
                                         showModalCatalogo,
                                         codigoProdutoCatalogo,
                                         descricaoProdutoCatalogo,
                                         loadingQtdeOrdensSemGrupo,
                                         qtdeOrdensSemGrupo,
                                         ordensSemGrupo,
                                         LoadingOrdensSemGrupo,
                                         ordensComGrupo,
                                         totalOrdensSemGrupoFiltradas,
                                         loadingMateriaPrima,
                                         materiaPrima,
                                         materiaPrimaTotal,
                                         usuarioLogado,
                                         listStatusOrdemFabricacao
                                       }) {
  const dispatch = useDispatch();
  const [showModalPreDrop, setShowModalPreDrop] = useState(false);
  const [ isModalVisible, setIsModalVisible] = useState(false);
  const [isLinhaSelecionada, setIsLinhaSelecionada] = useState(false);
  const [showTrashCan, setShowTrashCan] = useState(false)
  const [criando, setCriando] = useState(false)
  const [ordensIniciais, setOrdensIniciais] = useState([])
  const [modalDesbloquear, setModalDesbloquear] = useState(false)
  const [modalDesbloquearGrupo, setModalDesbloquearGrupo] = useState({})
  useEffect(() => {
    setOrdensIniciais(ordensGrupo.map(ordem => ({id: ordem.id, ordem: ordem.ordem * 10})))
  }, [ordensGrupo])
  useEffect(() => {
    dispatch(setGrupoSelecionado(null))
  }, [])

  const showModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const handleOk = () => {
    setIsModalVisible(false);
    reloadOrdens()
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reloadOrdens()
  };

  const reloadOrdens = () => {
    dispatch(getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest({}))
    if(grupoSelecionado) {
      dispatch(buscarOrdensGrupoRequest(grupoSelecionado))
      dispatch(getOrdensDeProducaoProdutosAssociadoGrupoRequest(grupoSelecionado))
    }
  }

  useEffect(() => {
    if (produtoSelecionado && produtoSelecionado.quantidade) {
      setShowModalPreDrop(true)
    }
  }, [produtoSelecionado])

  function handleSelectGrupo(e) {
    dispatch(setGrupoSelecionado(e))
    dispatch(buscaLinhasGrupoRequest(e))
    dispatch(buscarOrdensGrupoRequest(e))
    dispatch(getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest({}))
    dispatch(getOrdensDeProducaoProdutosAssociadoGrupoRequest(e))
    setIsLinhaSelecionada(true)
  }

  function beforeSave(values) {
    if (values.separacao && !values.materiaPrima?.length){
      Alert.error(getMessage("sequenciamento.model.semMp.label"))
      return
    }
    handleCancelModal()
    if(values.dataSeparacao !== undefined && values.dataSeparacao !== null) {
      values = {
        ...values,
        dataSeparacao: values.dataSeparacao.format("DD/MM/YYYY"),
        horaSeparacao: values.horaSeparacao.format("HH:mm:ss"),
      }
    } else {
      values = {
        ...values,
        dataSeparacao: null,
        horaSeparacao: null,
      }
    }
    dispatch(salvarRequest({...produtoSelecionado, ...values, codigoOrdemAnterior, idGrupoLinha: grupoSelecionado}, grupoSelecionado))
  }

  function handleCancelModal() {
    setShowModalPreDrop(false)
    dispatch(cancelaDrop())
  }

  function handleHideModalCatalogo() {
    dispatch(hideModalCatalogo())
  }

  function ordensForamAlteradas(){
    return ordensIniciais.some(o => ordensGrupo.find(ord => ord.id == o.id)?.ordem * 10 != o?.ordem)
  }

  function mudarOrdensSemArrastar(){
    const novasOrdens = [...ordensIniciais].sort((a, b) => a.ordem - b.ordem).map(o => o.id)
    dispatch(mudarOrdemRequest(grupoSelecionado, novasOrdens))
  }

  function openModalDesbloquear(grupo) {
    setModalDesbloquear(true)
    setModalDesbloquearGrupo(grupo)
  }

  return (
    <>
      <PageHeader
        className={"header-sequenciamento"}
        ghost={false}
        onBack={() => history.push(CLIENT_URL)}
        title={getMessage("sequenciamento.title.label")}/>

      <SelectGrupo listaGrupos={listaGrupos}
                   openModal={openModalDesbloquear}
                   handleSelectGrupo={handleSelectGrupo}
                   grupoSelecionado={grupoSelecionado}
                   getMessage={getMessage}
                   usuarioLogado={usuarioLogado} />

      {qtdeOrdensSemGrupo > 0 && !loadingQtdeOrdensSemGrupo && <div className={"div-produtos-nao-associados"}>
        <Spin tip={getMessage("sequenciamento.buscandoOrdensComProdutosNaoAssociados.message")}
              spinning={loadingQtdeOrdensSemGrupo}>
          <Row>
            {qtdeOrdensSemGrupo > 0 && !loadingQtdeOrdensSemGrupo && <>
              <span className={"text-OP-produto-nao-associado-GL"}>
              <ExclamationCircleFilled/> {getMessage("sequenciamento.ordensProducao.produtosNaoAssociados", {argument: qtdeOrdensSemGrupo})} </span>
              <Button onClick={showModal}>Ver Ordens</Button>
              <ModalProdutosSemGrupo
                getMessage={getMessage}
                totalOrdensSemGrupoFiltradas={totalOrdensSemGrupoFiltradas}
                isModalVisible={isModalVisible}
                handleOk={handleOk}
                listaGrupos={listaGrupos}
                handleCancel={handleCancel}
                ordensSemGrupo={ordensSemGrupo}
                LoadingOrdensSemGrupo={LoadingOrdensSemGrupo}
              />
            </>}
          </Row>
        </Spin>
      </div>}
      {
        isLinhaSelecionada ?
          <>
            {ordensForamAlteradas() && <Button
              type="danger"
              onClick={mudarOrdensSemArrastar}
              style={{marginBottom: 5, marginLeft: 'auto', display: 'flex'}}
            >
              {getMessage("sequenciamento.ordem.semArrastar.botao.label")}
            </Button>}
            <div className="sequenciamento">
              <SidebarProdutos produtos={ordensComGrupo} ordensDeFabricacao={ordensGrupo} showTrashCan={showTrashCan} grupoSelecionado={grupoSelecionado} setCriando={setCriando}/>
              <AreaSequenciamento buscarOrdensGrupoRequest={buscarOrdensGrupoRequest} listStatusOrdemFabricacao={listStatusOrdemFabricacao} ordensDeFabricacao={ordensGrupo} setShowTrashCan={setShowTrashCan} criando={criando} grupoSelecionado={grupoSelecionado} ordensIniciais={ordensIniciais} setOrdensIniciais={setOrdensIniciais} />
            </div>
          </>
          : ""
      }

      <ModalDesbloquear
        visible={modalDesbloquear}
        setVisible={setModalDesbloquear}
        grupo={modalDesbloquearGrupo}
        getMessage={getMessage}
        handleSelectGrupo={handleSelectGrupo}
      />

      <ModalCatalogoProduto
        visible={showModalCatalogo}
        codigoProduto={codigoProdutoCatalogo}
        descricaoProduto={descricaoProdutoCatalogo}
        handleCancel={handleHideModalCatalogo}
      />

      <ModalBeforeDrop show={showModalPreDrop} linhas={linhasGrupo} onCancel={handleCancelModal} onConfirm={beforeSave}
                       quantidadeMaxima={produtoSelecionado.quantidade} quantidadePorPallet={produtoSelecionado.quantidadePorPallet}
                       produto={produtoSelecionado} materiaPrima={materiaPrima} materiaPrimaTotal={materiaPrimaTotal}
                       loadingMateriaPrima={loadingMateriaPrima} getMessage={getMessage}/>
    </>
  );
}
