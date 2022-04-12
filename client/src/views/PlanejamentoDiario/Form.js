import * as React from "react";
import {Button, Checkbox, Col, Form, List, Row, Select, Tag, TimePicker, Transfer} from "antd";
import {useEffect, useState} from "react";
import {getMessage} from "../../components/messages";
import {InputNumberAnt} from "../../components/form/InputNumber";
import * as moment from "moment";
import {DatePickerAnt} from "../../components/form/DatePicker";
import {SelectFilter} from "../../components/form/SelectFilter";
import {RangeDatePickerAnt} from "../../components/form/RangeDatePicker";
import {corrigeDataParaEnvio} from "../../utils/utils";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './style.css';
import ColorPic from "./ColorPic";

function PlanejamentoDiarioForm(props) {
  const [linhaProducaoSelected, setLinhaProducaoSelected] = useState(null);
  const [grupoLinhaProducaoSelected, setGrupoLinhaProducaoSelected] = useState(null);

  const [criarMultiplos, setCriarMultiplos] = useState(false)
  const [turno, setTurno] = useState(null)
  const { form, entityInstance, linhasProducao, dias, gruposLinhaProducao, turnos, isNovo, onFinish } = props
  const [data, setData] = useState(null)
  const [multiplosDias, setMultiplosDias] = useState(null)
  const [conteudoObservacao, setConteudoObservacao] = useState(EditorState.createEmpty());

  useEffect(() => {
    form.setFieldsValue({
      data: entityInstance.data && moment(entityInstance.data, "DD/MM/YYYY"),
      linhaDeProducao: entityInstance.linhaDeProducao,
      grupoLinhaDeProducao: entityInstance.grupoLinhaDeProducao,
      turno: entityInstance.turno,
      quantidadePlanejadaPecas: entityInstance.quantidadePlanejadaPecas,
      quantidadePlanejadaPessoas: entityInstance.quantidadePlanejadaPessoas,
      quantidadePessoasPresentes: entityInstance.quantidadePessoasPresentes,
      pessoasTreinamento: entityInstance.pessoasTreinamento,
      pessoasHabilitadas: entityInstance.pessoasHabilitadas,
    })
    setData(entityInstance.data && moment(entityInstance.data, "DD/MM/YYYY"))
    setTurno(entityInstance.turno)
    setGrupoLinhaProducaoSelected(entityInstance.grupoLinhaDeProducao)
    setLinhaProducaoSelected(entityInstance.linhaDeProducao)
    const contentBlock = entityInstance.observacao ? htmlToDraft(entityInstance.observacao) : null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setConteudoObservacao(EditorState.createWithContent(contentState));
    }
  }, [entityInstance])

  useEffect(() => {
    if (data?.valueOf()  >= new Date().getTime()){
      form.setFieldsValue({
        quantidadePessoasPresentes: 0,
        pessoasTreinamento: 0,
        pessoasHabilitadas: 0
      })
    }
  }, [data])

  const toolbarConfig = {
    options: ['inline', 'colorPicker'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline'],
    },
    colorPicker: { component: ColorPic },
  }

  function salvar(values){
    const conteudoObservacaoRaw = convertToRaw(conteudoObservacao.getCurrentContent())

    values.data = values.data && values.data.format("DD/MM/YYYY")
    values.observacao = draftToHtml(conteudoObservacaoRaw) && checkTextDraft(conteudoObservacaoRaw) ? draftToHtml(convertToRaw(conteudoObservacao.getCurrentContent())) : null;

    corrigeDataParaEnvio(values, 'multiplosDias', "DD/MM/YYYY")
    onFinish(values)
    setTurno(null)
  }

  function checkTextDraft(text) {
    let pureText = ""
    let currentText = text?.blocks[0]?.text
    if(currentText){
      currentText.split("").map( letter => letter !== " " && ( pureText += letter ))
      return !(pureText === "")
    } else return false

  }

  function duracoesDoTurno() {
    return turno ? turnos.find(t => t.id === turno)?.duracoes : []
  }

  function diaPertenceAoRange(inicio, fim, dia) {
    for (let m = moment(inicio); m.diff(fim, 'days') <= 0; m.add(1, 'days')) {
      if(dia === m.weekday()) return true;
    }

    return false
  }

  function corTagDia(dia) {
    const valueMultiplos = multiplosDias
    if(criarMultiplos && valueMultiplos && valueMultiplos.length && valueMultiplos.filter(v => v).length > 1) {
      return diaPertenceAoRange(valueMultiplos[0], valueMultiplos[1], dia) ? "green" : "red"
    } else {
      return !data ? "default" : moment(data).weekday() === dia ? "green" : "red";
    }
  } 

  function configTable(){
    return {
      i18n: "planejamento.turno.tabela.",
      size: "small",
      columns: [
        {
          key: "inicio",
        },
        {
          key: "fim",
        },
        {
          key: "diasDaSemana",
          render: (val, item) => {
            return item.dias.map(v => <Tag color={corTagDia(v.numeroDia)}>{getMessage(`turnos.dias.extenso.${v.dia}.label`)}</Tag>)
          }
        },
      ],
      data: duracoesDoTurno() || [],
    }
  }

  return (
    <Form form={form} layout={"vertical"} onFinish={salvar}>
      <Row gutter={24}>
        <Col span={8}>
          {(isNovo && criarMultiplos)
            ? <RangeDatePickerAnt
              isRequired
              label={getMessage("planejamentoDiario.datas.label")}
              nomeAtributo={"multiplosDias"}
              onCalendarChange={setMultiplosDias}
              rules={[{
                validator: (_, value) => {
                  if (!value || value[1].diff(value[0], 'days') <= 30){
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(getMessage("planejamentoDiario.datas.periodoGrande.label")));
                }
              }]}
            />
            : <DatePickerAnt
              isRequired
              onChange={setData}
              label={getMessage("planejamentoDiario.data.label")}
              nomeAtributo={"data"}
            />
          }
        </Col>
        <Col span={8}>
          <SelectFilter
            isRequired
            hasFormItem
            allowClear
            label={getMessage("planejamentoDiario.linhaDeProducao.label")}
            nomeAtributo={"linhaDeProducao"}
            list={filtraLinhasPorGrupo(linhasProducao, grupoLinhaProducaoSelected)}
            onChange={(e) => setLinhaProducaoSelected(e)}
            isDisabled={filtraLinhasPorGrupo(linhasProducao, grupoLinhaProducaoSelected).length === 0}
          />
        </Col>
        <Col span={8}>
          <SelectFilter
            isRequired
            hasFormItem
            allowClear
            label={getMessage("planejamentoDiario.grupoLinhaDeProducao.label")}
            nomeAtributo={"grupoLinhaDeProducao"}
            list={filtraGruposPorLinha(gruposLinhaProducao, linhaProducaoSelected)}
            onChange={(e) => setGrupoLinhaProducaoSelected(e)}
            isDisabled={filtraGruposPorLinha(gruposLinhaProducao, linhaProducaoSelected).length === 0}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <SelectFilter
            isRequired
            hasFormItem
            label={getMessage("planejamentoDiario.turno.label")}
            nomeAtributo={"turno"}
            list={turnos.map(t => ({key: t.id, value: t.nome}))}
            onChange={setTurno}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            isRequired
            label={getMessage("planejamentoDiario.quantidadePlanejadaPecas.label")}
            nomeAtributo={"quantidadePlanejadaPecas"}
            min={1}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            isRequired
            label={getMessage("planejamentoDiario.quantidadePlanejadaPessoas.label")}
            nomeAtributo={"quantidadePlanejadaPessoas"}
            min={1}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <InputNumberAnt
            disabled={isNovo || data?.valueOf() >= new Date().getTime()}
            label={getMessage("planejamentoDiario.quantidadePessoasPresentes.label")}
            nomeAtributo={"quantidadePessoasPresentes"}
            min={0}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            label={getMessage("planejamentoDiario.pessoasHabilitadas.label")}
            nomeAtributo={"pessoasHabilitadas"}
            min={0}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            label={getMessage("planejamentoDiario.pessoasTreinamento.label")}
            nomeAtributo={"pessoasTreinamento"}
            min={0}
          />
        </Col>
        {isNovo && <Col span={8}>
          <Checkbox
            value={criarMultiplos}
            onChange={(e) => setCriarMultiplos(e.target.checked)}
            style={{marginTop: 30}}
          >
            {getMessage("planejamentoDiario.criarMultiplos.label")}
          </Checkbox>
        </Col>}
      </Row>
      <h4
        style = {{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, .85)',
        }}
      >{getMessage('planejamentoDiario.observacao.label')}</h4>
      <Editor
        editorState={conteudoObservacao}
        editorClassName='editor-observacao'
        onEditorStateChange={setConteudoObservacao}
        toolbar={toolbarConfig}
      />
      <br />
      {turno && <Row gutter={24}>
        <Col span={24}>
          <TabelaAnt configTable={configTable()}/>
        </Col>
      </Row>}
    </Form>
  )

  function tratarStringParaSelect(list){
    return (list || []).map(l => ({key: l, value: l}))
  }

  function formataDiasParaSelect(dias){
    return dias.map(d => ({key: d, value:getMessage(`turnos.dias.extenso.${d}.label`)}))
  }

  function filtraGruposPorLinha(grupos, linha) {
    if(!linha) return grupos.map(gr => ({key: gr.id, value: gr.nome}));

    // filtra os grupos que possuem a linha que está selecionada
    return grupos.filter(grupo => grupo.linhas.some(l => l.id === linha)).map(gr => ({key: gr.id, value: gr.nome}));
  }

  function filtraLinhasPorGrupo(linhas, grupo) {
    if(!grupo) return linhas.map(l => ({
      key: l.id,
      value: l.nome
    }));

    // filtra as linhas que fazem parte do grupo selecionado
    return gruposLinhaProducao.find(g => g.id === grupo).linhas.map(l => ({
        key: l.id,
        value: l.nome
    }));
  }
}

export default PlanejamentoDiarioForm;
