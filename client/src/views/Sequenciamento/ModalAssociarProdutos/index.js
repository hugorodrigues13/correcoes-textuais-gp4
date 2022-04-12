import React, { useState } from "react";
import {useDispatch} from "react-redux";
import {Modal, Row, Button, Spin, Table, Tooltip} from "antd";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {HiOutlineLink} from "react-icons/all";
import { formataListaParaSelect } from "../../../utils/formatador";
import {SelectFilter} from "../../../components/form/SelectFilter";
import {associarProdutoAoGrupoRequest} from "../../../store/modules/Sequenciamento/action";



export default function ModalAssociarProdutos({ getMessage,
                                                listaGrupos,
                                                produtoSemGrupoSelecionado, showModal, handleCloseModal, filtros }) {
  const dispatch = useDispatch();

  const [ grupoParaProdutoSemGrupo, setGrupoParaProdutoSemGrupo ] = useState(null);

  function selecionarGrupoParaProdutoSemGrupo (id) {
    setGrupoParaProdutoSemGrupo(id)
  }

  function associarProdutoAoGrupoDeLinhas () {
    dispatch(associarProdutoAoGrupoRequest({produto: produtoSemGrupoSelecionado, idGrupoLinha: grupoParaProdutoSemGrupo}, filtros))
    handleCloseModal()
  }

  function fechaModal() {
    setGrupoParaProdutoSemGrupo(null)
    handleCloseModal()
  }

  return (
          <Modal
            title={getMessage("sequenciamento.produtosNaoAssociados.associarAoGrupoDeLinhas.label")}
            visible={showModal}
            onOk={associarProdutoAoGrupoDeLinhas}
            onCancel={fechaModal}
            okText={"Salvar"}
            cancelText={"Cancelar"}
            okButtonProps={{ disabled: !grupoParaProdutoSemGrupo}}
            destroyOnClose={true}
          >
            <SelectFilter
              nomeAtributo={"grupoParaProdutoSemGrupo"}
              placeholder={getMessage("sequenciamento.grupoLinhasProducao.placeholder")}
              list={formataListaParaSelect(listaGrupos, "id", "nome")}
              onChange={selecionarGrupoParaProdutoSemGrupo}
            />
          </Modal>
  )

}
