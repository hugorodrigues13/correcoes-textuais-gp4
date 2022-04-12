import * as React from "react";
import { Button, Col, Form, Row } from "antd";
import {useEffect, useState} from "react";
import {InputAnt} from "../../components/form/Input";
import {getMessage} from "../../components/messages";
import {AiOutlinePlus} from "react-icons/ai";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {SelectAnt} from "../../components/form/SelectAnt";
import {TimePickerAnt} from "../../components/form/TimePicker";
import Alert from 'react-s-alert';
import * as moment from "moment";

function TurnosForm(props) {

  const [duracaoForm] = Form.useForm()
  const { form, entityInstance, dias, onFinish } = props;
  const [duracoes, setDuracoes] = useState([])
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    form.setFieldsValue({
      nome: entityInstance.nome
    })
    setDuracoes(entityInstance.duracoes || [])
  }, [entityInstance])

  function renderTurnoForm(){
    return <>
      <Row gutter={24}>
        <Col span={24}>
          <InputAnt
            isRequired
            nomeAtributo={"nome"}
            label={getMessage("turnos.form.nome.label")}
            message={getMessage("comum.obrigatorio.campo.message")}
          />
        </Col>
      </Row>
    </>
  }

  function renderDuracoesTabela(){
    function adicionarNaTabela(values){
      const { horarioFinal, duracao, horarioInicial, dias } = values
      const novaDuracao = { horarioFinal, duracao, horarioInicial, dias }
      novaDuracao.horarioFinal = typeof novaDuracao.horarioFinal === 'string' ? novaDuracao.horarioFinal : novaDuracao.horarioFinal.format("HH:mm")
      novaDuracao.duracao = typeof novaDuracao.duracao === 'string' ? novaDuracao.duracao : novaDuracao.duracao.format("HH:mm")
      novaDuracao.horarioInicial = typeof novaDuracao.horarioInicial === 'string' ? novaDuracao.horarioInicial : novaDuracao.horarioInicial.format("HH:mm")
      if (editando) {
        novaDuracao.id = editando.id
        const novasDuracoes = [...duracoes]
        const index = novasDuracoes.findIndex(t => t.dias.some(d => editando.dias.includes(d)))
        novasDuracoes.splice(index, 1, novaDuracao)
        setDuracoes(novasDuracoes)
        setEditando(null)
      } else {
        setDuracoes([...duracoes, novaDuracao])
      }
      duracaoForm.resetFields()
    }
    function deletar(objeto) {
      setDuracoes(duracoes.filter(t => !t.dias.every(d => objeto.dias.includes(d))))
    }
    function editar(objeto) {
      setEditando(objeto)
      duracaoForm.setFieldsValue({
        horarioFinal: moment(objeto.horarioFinal, 'HH:mm'),
        duracao: moment(objeto.duracao, 'HH:mm'),
        horarioInicial: getHorarioInicial(moment(objeto.horarioFinal, 'HH:mm'), moment(objeto.duracao, 'HH:mm')),
        dias: objeto.dias,
      })
    }

    function setHorarioInicial() {
      if(duracaoForm.getFieldValue('duracao') && duracaoForm.getFieldValue('horarioFinal')) {
        duracaoForm.setFieldsValue({
          horarioInicial: getHorarioInicial(duracaoForm.getFieldValue('horarioFinal'), duracaoForm.getFieldValue('duracao')),
        })
      }
    }

    function configTable(){
      return {
        i18n: "turnos.form.",
        columns: [
          {
            key: 'horarioFinal',
          },
          {
            key: 'horarioInicial'
          },
          {
            key: 'duracao',
          },
          {
            key: 'dias',
            render: (dias) => dias.map(d => getMessage(`turnos.dias.extenso.${d}.label`)).join(", ")
          }
        ],
        acoes: {
          editModal: true,
          editar: editar,
          excluir: deletar
        },
        data: duracoes,
      }
    }
    return (
      <Form form={duracaoForm} onFinish={adicionarNaTabela}>
        <Row gutter={24}>
          <Col span={4}>
            <TimePickerAnt
              isRequired
              nomeAtributo={"horarioFinal"}
              label={getMessage("turnos.form.horarioFinal.label")}
              placeholder={getMessage("turnos.form.horarioFinal.label")}
              onChange={setHorarioInicial}
            />
          </Col>
          <Col span={5}>
            <TimePickerAnt
              isRequired
              nomeAtributo={"duracao"}
              label={getMessage("turnos.form.duracao.label")}
              placeholder={getMessage("turnos.form.duracao.label")}
              showNow={false}
              onChange={setHorarioInicial}
            />
          </Col>
          <Col span={5}>
            <TimePickerAnt
              disabled
              nomeAtributo={"horarioInicial"}
              label={getMessage("turnos.form.horarioInicial.label")}
              placeholder={getMessage("turnos.form.horarioInicial.label")}
            />
          </Col>
          <Col span={8}>
            <SelectAnt
              isRequired
              nomeAtributo={"dias"}
              modo={"tags"}
              ordenar={false}
              optionLabelProp={"label"}
              label={getMessage("turnos.form.dias.label")}
              list={formataDiasParaSelect(dias || [])}
              rules={[{
               validator: (_, value) => {
                 if (!value || duracoes.every(d => !(d.dias.filter(dia => !editando?.dias?.includes(dia))).some(dia => value.includes(dia)))) {
                   return Promise.resolve();
                 }
                 return Promise.reject(new Error(getMessage("turnos.form.dias.jaAdicionado.label")));
               }
              }]}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              key="submit"
              size="large"
              style={{marginTop: 27, width: '100%'}}
              onClick={() => duracaoForm.submit()}
            >
              <AiOutlinePlus size={"1.5em"} />
            </Button>
          </Col>
        </Row>
        <br/>
        <Row gutter={24}>
          <Col span={24}>
            <TabelaAnt configTable={configTable()}/>
          </Col>
        </Row>
      </Form>
    )
  }

  function salvar(values){
    if (!duracoes?.length){
      Alert.error(getMessage("turnos.form.dias.nenhumAdicionado.label"))
      return
    }
    values.duracoes = duracoes
    onFinish(values)
    resetar()
  }

  function resetar(){
    setEditando(null)
    setDuracoes([])
    duracaoForm.resetFields()
  }

  return (
    <Form form={form} layout={"vertical"} onFinish={salvar}>
      {renderTurnoForm()}
      {renderDuracoesTabela()}
    </Form>
  )

  function formataDiasParaSelect(dias){
    return dias.map(d => ({key: d, value:getMessage(`turnos.dias.extenso.${d}.label`) , label: getMessage(`turnos.dias.curto.${d}.label`)}))
  }

  function getHorarioInicial(horarioFinal, duracao) {
    return moment(moment(horarioFinal).subtract({hours: duracao.hours(), minutes: duracao.minutes()}));
  }
}

export default TurnosForm;
