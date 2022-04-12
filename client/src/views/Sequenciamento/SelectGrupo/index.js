import React, {useEffect, useRef, useState} from "react";
import {Form, Tooltip} from "antd";
import {SelectFilter} from "../../../components/form/SelectFilter";
import {AiFillLock} from "react-icons/all";

const SelectGrupo = ({grupoSelecionado, openModal, listaGrupos, usuarioLogado, handleSelectGrupo, getMessage}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      grupo: grupoSelecionado
    })
  }, [grupoSelecionado])

  function formatarListaGrupos(){
    function renderValue(grupo){
      const bloqueado = grupo.usuario?.id && grupo.usuario.id !== usuarioLogado.id
      return <>
        <span>
          {grupo.nome}
        </span>
        {bloqueado && (
          <span style={{float: "right"}}>
            <Tooltip
              title={getMessage("sequenciamento.bloqueado.label", {usuario: grupo.usuario.nome})}
              placement="left"
            >
              <AiFillLock size={20} onClick={() => openModal(grupo)}/>
            </Tooltip>
          </span>
        )}
      </>
    }
    return [...listaGrupos]
      .sort((a, b) => (a.nome || "").toLowerCase() > (b.nome || "").toLowerCase() ? 1 : -1)
      .map(g => ({
        key: g.id,
        label: g.nome,
        disabled: g.usuario?.id && g.usuario.id !== usuarioLogado.id,
        value: renderValue(g),
      }))
  }

  return (
    <Form form={form}>
      <SelectFilter
        nomeAtributo={"grupo"}
        placeholder={getMessage("sequenciamento.grupoLinhasProducao.placeholder")}
        list={formatarListaGrupos()}
        ordenar={false}
        defaultValue={grupoSelecionado}
        optionLabelProp="label"
        onChange={handleSelectGrupo}
      />
    </Form>
  )
}

export default SelectGrupo
