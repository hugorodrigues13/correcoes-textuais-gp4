import React, {useEffect, useRef, useState} from 'react';
import {Form, Col, Row, Spin, Select, InputNumber, Popover, Input, Badge, Tooltip} from "antd";
import {UndoOutlined, CloseCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import TreeView from "react-simple-jstree";
import {InputAnt} from "../../components/form/Input";
import {linhaProducaoSalvarRequest, linhaProducaoEditarRequest} from "../../store/modules/LinhaDeProducao/action";
import {SelectAnt} from "../../components/form/SelectAnt";
import {FlowChart, LinkDefault} from "@mrblenny/react-flow-chart/src";
import * as S from "./style";
import "./style.css";
import styled from "styled-components";
import Draggable from "../../components/DragDrop/Draggable";
import Droppable from "../../components/DragDrop/Droppable";
import {v4} from "uuid";
import FluxoDeProcessos from "./FluxoDeProcessos";
import Alerta from "../../components/alertas/Alerta";
import Alert from "react-s-alert";
import {getMessage} from "../../components/messages";
import {BsLink45Deg} from "react-icons/all";
import {criarLinkDefeito, deletarLinksDefeitoAntigo, validateLink} from "./actions";
// import Alerta from "../../components/Alerta";

export const LinhaDeProducaoForm = (props => {
  const [form] = Form.useForm()
  const {listGrupoRecurso, getMessage, id, entityInstance, retornoEditar, error: errors} = props;
  const dispatch = useDispatch();
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;
  const fluxoRef = useRef(null);
  const [requiredLink, setRequiredLink] = useState({
    color: '#d9d9d9',
    isDefeito: false,
    isGrupos: false
  });
  const [diagrama, setDiagrama] = useState({
    offset: {
      x: 0,
      y: 0
    },
    scale: 0.6,
    nodes: {},
    links: {},
    selected: {},
    hovered: {}
  });
  const [diagramaID, setDiagramaID] = useState({});
  const [nome, setNome] = useState(null);
  const [defeitoSelecionado, setDefeitoSelecionado] = useState(null)
  const [grupoSelecionado, setGrupoSelecionado] = useState(null)

  useEffect(() => {
    if (errors?.messages?.some((err) => err.type !== "ERROR_TYPE")) {
      form.resetFields();
      setNome(null);
      setDiagrama({
        offset: {
          x: 0,
          y: 0
        },
        scale: 0.6,
        nodes: {},
        links: {},
        selected: {},
        hovered: {}
      });
    }
  }, [errors]);

  let validarLinks

  useEffect(() => {
    form.setFieldsValue({
      grupoRecurso: entityInstance.grupoRecurso,
      processo: entityInstance.processo,
      nome: entityInstance.nome,
      apontamentos: entityInstance.apontamentos,
      key: entityInstance.key
    });
  }, [entityInstance], [diagrama]);

  useEffect(() => {
    console.log(defeitoSelecionado, grupoSelecionado)
    if (defeitoSelecionado && grupoSelecionado){
      // from = defeito, to = grupo
      if (validateLink({linkId: null, fromNodeId: defeitoSelecionado.id, fromPortId: null, toNodeId: grupoSelecionado.id, toPortId: null, chart: fluxoChart})){
        console.log('pode')
        console.log(fluxoChart.links)
        deletarLinksDefeitoAntigo(defeitoSelecionado, grupoSelecionado, fluxoChart)
        criarLinkDefeito(defeitoSelecionado, grupoSelecionado, fluxoChart)
        setFluxoChart(fluxoChart)

      } else {
        console.log('nao pode')
      }
      setDefeitoSelecionado(null)
      setGrupoSelecionado(null)
    }
  }, [defeitoSelecionado, grupoSelecionado])

  const NodeInner = ({node, config}) => {
    let array = []
    let nodes = Object.values(diagrama.links)
    let links = diagrama.links
    const objSelecionado = Object.values(fluxoChart.selected).find(item => item.id === node.id)

    if (node.properties.custom.tipo === 'grupoRecurso' && node.ports['port3'] && node.ports['port3'].position) {
      node.ports['port3'].position.y = 115
    }
    if (node.ports['port1'] && node.ports['port1'].position && node.ports['port1'].properties.custom.tipo === 'grupoRecurso') {
      node.ports['port1'].position.y = 115
    }

    const linksValidadores = nodes.filter(item => item.to.portId === "port1" || item.from.portId === "port2")

    linksValidadores.map(item => {
      if (item.to.nodeId !== undefined) {
        array.push(item.to.nodeId.toString())
      }
      if (item.from.nodeId !== undefined) {
        array.push(item.from.nodeId.toString())
      }
    })

    let nodeSalvar = (Object.values(fluxoChart.nodes)).filter(item => item.properties.custom.tipo === "grupoRecurso")

    validarLinks = nodeSalvar.map(item => array.includes(item.id.toString()))

    const nos = Object.keys(diagrama.nodes)
    const nosValues = (Object.values(diagrama.links)).filter(item => item.to.portId === "port1" || item.from.portId === "port2")

    const values = Object.values(diagrama.nodes).sort((a, b) => a.position.x - b.position.x)

    if (isNaN(node.position.x) || isNaN(node.position.y)) {
      node.position = {
        x: 0,
        y: 0,
      }
    }

    if (node.properties.custom.tipo !== undefined && node.properties.custom.tipo === "defeito") {
      return (
        <S.Outer style={{background: objSelecionado !== undefined ? "#BAC8D370": "#BAC8D3"}}>
          <Row style={{
            textAlign: "center",
            display: "block",
            fontSize: "1.2em",
            fontWeight: "bold",
          }}>
            <p>{node.properties.value}</p>
            <BsLink45Deg
              size={30}
              className={"linkar-defeito-grupo"}
              onClick={() => setDefeitoSelecionado(defeitoSelecionado?.id === node?.id ? null : node)}
              style={defeitoSelecionado?.id === node?.id ? {color: 'red'} : {}}
            />

          </Row>
        </S.Outer>)
    } else {
      return (
        <S.Outer
          style={{background: objSelecionado !== undefined ? "#60a91770" : "#60a917"}}
          >
          <BsLink45Deg
            size={30}
            className={"linkar-defeito-grupo grupo"}
            onClick={() => setGrupoSelecionado(grupoSelecionado?.id === node?.id ? null : node)}
            style={grupoSelecionado?.id === node?.id ? {color: 'red'} : {}}
          />
          <Row
            style={{
              fontWeight: "bold",
              cursor: "pointer"
            }}
            className={"iconCloseCircleOutlined"}
          >
            <CloseCircleOutlined
              onClick={() => {
                deleteKey(node);
                setFluxoChart(fluxoChart)
              }}
            />
          </Row>
          <Row
            style={{
              marginTop: 15,
              textAlign: "center",
              display: "block",
              fontSize: "1.3em",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            <p>{node.properties.value}</p>
          </Row>
          <Row>
            <Col span={18}/>
            <Popover
              content={<InputNumber
                nomeAtributo="apontamentos"
                isRequired={true}
                min={1}
                onChange={(value) => node.properties.custom.apontamentos = value}
                defaultValue={node.properties.custom.item.apontamentos}
              />}
              title="Quantidade Máxima de Reprocessos"
              trigger="click"
            >
              <Col span={4}>
                {
                  node.properties.custom.apontamentos === null ?
                    <Badge count={node.properties.custom.apontamentos} offset={[-18, 17]}>
                      <UndoOutlined style={{fontSize: "2.5em", cursor: 'pointer'}}/>
                    </Badge> : node.properties.custom.apontamentos < 10 ?
                    <Badge count={node.properties.custom.apontamentos} style={{
                      backgroundColor: objSelecionado !== undefined ? "#60a91710" : "#60a917",
                      borderColor: '#60A91730',
                      fontSize: "16px",
                      color: '#000',
                      fontWeight: "bold",
                      cursor: 'pointer'
                    }} offset={[-18, 17]}>
                      <UndoOutlined style={{fontSize: "2.5em"}}/>
                    </Badge> :
                    <Badge count={node.properties.custom.apontamentos} style={{
                      backgroundColor: objSelecionado !== undefined ? "#60a91725" : "#60a917",
                      borderColor: '#60A91730',
                      fontSize: "13px",
                      color: '#000',
                      cursor: 'pointer'
                    }} offset={[-16, 18]}>
                      <UndoOutlined style={{fontSize: "2.5em"}}/>
                    </Badge>
                }
              </Col>
            </Popover>
          </Row>
        </S.Outer>
      )
    }
  }

  const PageContent = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    max-width: 100vw;
    max-height: 100%;
    border: 1px solid;
    border-color: ${requiredLink.color};
  `

  const PortDef = (port) => {

    if (port.port.properties.custom.tipo &&
      port.port.properties.custom.tipo === 'defeito' &&
      port.port.type === 'left') {
      return (<S.PortDefaultOuter/>)
    }
    if (port.port.properties.custom.tipo &&
      port.port.properties.custom.tipo === 'grupoRecurso' &&
      port.port.id === 'port1') {

      port.port.position.y = 70
      return (<>
        <div style={{height: '40px'}}></div>
        <S.PortOuter/>
      </>)
    }
    if (port.port.properties.custom.tipo &&
      port.port.properties.custom.tipo === 'grupoRecurso' &&
      port.port.id === 'port3') {
      return (<>
        <div style={{height: '25px'}}></div>
        <S.PortDefaultOuter/>
      </>)
    }
    if (port.port.properties.custom.tipo &&
      port.port.properties.custom.tipo === 'grupoRecurso' &&
      port.port.id === 'port2') {
      return (<>
        <S.PortDefaultOuter/>
      </>)
    }

    return (<>
      <S.PortDefaultOuter/>
    </>)
  }

  const LinkCustom = (props) => {
    const {startPos, endPos, onLinkClick, link} = props
    const centerX = startPos.x + (endPos.x - startPos.x) / 2
    const centerY = startPos.y + (endPos.y - startPos.y) / 2

    const objLink = Object.values(fluxoChart.selected).find(item => item.id === props.link.id)


    if (objLink !== undefined && objLink.id === props.link.id) {
      if (props.link.to.portId === "port3") {
        props.fromPort.properties.linkColor = "#FF8000"
        endPos.y = 150.2
      }
      if (props.link.from.portId === "port4") {
        props.fromPort.properties.linkColor = "#001DBC"
      }
      if (props.link.from.portId === "port2") {
        props.fromPort.properties.linkColor = "#000000"
        startPos.y = 111.5
        endPos.y = 111.5
      }
      if(props.link.from.portId === "port3"){
        props.fromPort.properties.linkColor = "#001DBC"
      }
    } else {
      if (props.link.to.portId === "port3") {
        props.fromPort.properties.linkColor = "#FF800085"
        endPos.y = 150.2
      }
      if (props.link.from.portId === "port4") {
        props.fromPort.properties.linkColor = "#001DBC85"
      }
      if (props.link.from.portId === "port2") {
        props.fromPort.properties.linkColor = "#00000085"
        startPos.y = 111.5
        endPos.y = 111.5
      }
      if(props.link.from.portId === "port3"){
        props.fromPort.properties.linkColor = "#001DBC85"
      }
    }

    return (
      <>
        <LinkDefault {...props} />
      </>
    )
  }

  const Components = {NodeInner, CanvasOuter: S.CanvasOuterCustom, Port: PortDef, Link: LinkCustom}
  const config = {
    smartRouting: true,
      showArrowHead: true,
      validateLink: validateLink,
      zoom: {maxScale: 1, minScale: 0.4},
    key: '',
  }
  const [fluxoChart, setFluxoChart] = useState({})

  useEffect(() => {
    if (entityInstance.id) {
      if(retornoEditar && Object.values(diagramaID).length !== 0 && diagramaID !== {}){
        setFluxoChart(diagramaID)
      } else{
        let posFim = 0
        const processos = Object.assign({}, ...(entityInstance.processos || []).map(item => {
          let textLength = 0
          if(item.ordem > 0) {
            textLength = entityInstance.processos.filter(x=>x.ordem===item.ordem-1)[0].value.length
            posFim += (textLength<20 ? 200 : textLength*10) + 40
          }
          return {
            id: item.key,
            position: {
              x: item.ordem === 0 ? 40 : posFim + 40,
              y: 40,
            },
            ports: {
              port1: {
                id: 'port1',
                type: 'left',
                position: {
                  x: -5.5,
                  y: 90,
                },
                properties: {
                  custom: {tipo: 'grupoRecurso'},
                  linkColor: '#F00',
                },
              },
              port2: {
                id: 'port2',
                type: 'right',
                properties: {
                  custom: {tipo: 'grupoRecurso'},
                  linkColor: '#000000'
                },
              },
              port3: {
                id: 'port3',
                type: 'left',
                position: {
                  x: -5.5,
                  y: 95,
                },
                properties: {
                  custom: {tipo: 'grupoRecurso'},
                  linkColor: '#F00',
                },
              },
              port4: {
                id: 'port4',
                type: 'output',
                properties: {
                  custom: {tipo: 'grupoRecurso'},
                  linkColor: '#001DBC',
                },
              },
            },
            properties: {
              value: item.value,
              custom: {
                tipo: "grupoRecurso",
                grupoRecurso: item.defeitos,
                item,
                apontamentos: item.apontamentos
              }
            },
          }
        }).map(x => ({[x.id]: x})))

        const componentesLinkados = entityInstance.processos.filter((item, index) => item.ordem < entityInstance.processos.length - 1)

        const link = Object.assign({}, ...componentesLinkados.map((item, index) => {

          let proximoNo

          if (item.ordem < entityInstance.processos.length - 1) {

            const proximoElemento = entityInstance.processos.find(x => x.ordem === item.ordem + 1)

            if (proximoElemento === undefined) {
              proximoNo = "0"
            } else {
              proximoNo = proximoElemento.key.toString()
            }

            return {
              id: v4(),
              from: {
                nodeId: item.key,
                portId: "port2"
              },
              properties: {label: "linkGrupoRecurso"},
              to: {
                nodeId: proximoNo,
                portId: "port1"
              }
            }
          }
        }).map(x => ({[x.id]: x})))

        const values = Object.values(processos)

        const componentsDefeitos = Object.assign({}, ...values.map((item, index) => {
          const listDefeitosOrdenada = item.properties.custom.grupoRecurso.sort(function (a, b) {
            return a.id - b.id
          });

          return (
            Object.assign({}, ...listDefeitosOrdenada.map((elemento, indexElemento) => {
              return {
                id: v4(),
                position: {
                  x: values[index].position.x-((indexElemento+1)*5),
                  y: 95 + (100 * (indexElemento + 1)),
                },
                ports: {
                  port1: {
                    id: 'port1',
                    type: 'left',
                    properties: {
                      custom: {tipo: 'defeito'},
                      linkColor: '#FF8000'
                    },
                  },
                  port2: {
                    id: 'port2',
                    type: 'input',
                    properties: {
                      custom: 'property',
                      linkColor: '#F00',
                    },
                  },
                  port3: (indexElemento === listDefeitosOrdenada.length - 1) ?
                    {
                      id: '',
                      type: '',
                      properties: {},
                    } :
                    {
                      id: 'port3',
                      type: 'output',
                      properties: {
                        custom: 'property',
                        linkColor: '#001DBC',
                      },
                    },
                },
                properties: {
                  value: elemento.nome,
                  custom: {
                    tipo: "defeito",
                    grupoRecursoId: item.id,
                    defeitoId: elemento.id,
                  }
                },
              }
            }).map(x => ({[x.id]: x})))
          )
        }))

        const objeto = Object.assign({}, processos, componentsDefeitos);

        const linkDefeitosEntrada = Object.assign({}, ...Object.values(processos).map(item => {
          const defeitosGrupoRecurso = Object.values(componentsDefeitos).filter(elemento => elemento.properties.custom.grupoRecursoId === item.id)
          defeitosGrupoRecurso.sort(function (a, b) {
            return a.id - b.id
          });

          const link = Object.assign({}, ...defeitosGrupoRecurso.map((x, index) => {
            if (index === 0) {
              return {
                id: v4(),
                from: {
                  nodeId: item.id,
                  portId: "port4"
                },
                properties: {
                  grupoRecursoId: item.id,
                  defeitoId: x.properties.custom.defeitoId,
                  tipoLink: "readOnly",
                },
                to: {
                  nodeId: `${x.id}`,
                  portId: "port2"
                }
              }
            }
            for (let i of defeitosGrupoRecurso) {
              if (index - 1 === defeitosGrupoRecurso.indexOf(i)) {
                return {
                  id: v4(),
                  from: {
                    nodeId: i.id,
                    portId: "port3"
                  },
                  properties: {
                    grupoRecursoId: item.id,
                    defeitoId: x.properties.custom.defeitoId,
                    tipoLink: "readOnly",
                  },
                  to: {
                    nodeId: `${x.id}`,
                    portId: "port2"
                  }
                }
              }
            }
          }).map(y => ({[y.id]: y})))

          return link
        }))

        let linkDef = []
        let linkDefeitos = []

        entityInstance.processos.map(item =>
          item.reprocessos.map(elemento => {
            linkDef.push({
              key: elemento.defeito,
              nodeOrigem: (item.key),
              ordemRetorno: elemento.ordemRetorno,
            })
          }))

        linkDef.map(item => {
          for (let i of entityInstance.processos) {
            if (i.ordem === item.ordemRetorno) {
              linkDefeitos.push({
                key: item.key,
                nodeOrigem: item.nodeOrigem,
                nodeRetorno: i.key
              })
            }
          }
        })

        const linkDefeitosSaida = Object.assign({}, ...Object.values(componentsDefeitos).map(item => {
          for (let i of linkDefeitos) {
            if (i.key === item.properties.custom.defeitoId && i.nodeOrigem === item.properties.custom.grupoRecursoId) {
              return {
                id: v4(),
                from: {
                  nodeId: item.id,
                  portId: "port1"
                },
                properties: {
                  grupoRecursoId: i.nodeOrigem,
                  defeitoId: i.key,
                },
                to: {
                  nodeId: i.nodeRetorno,
                  portId: "port3"
                }
              }
            }
          }}).map(x => {
          return x ? {[x.id]: x} : []
        }))

        const todosLinks = Object.assign({}, link, linkDefeitosEntrada, linkDefeitosSaida)

        setFluxoChart({
          offset: {
            x: 0,
            y: 0
          },
          scale: 0.6,
          nodes:
          objeto,
          links:
          todosLinks,
          selected: {},
          hovered: {},
        })
      }
    } else {
      setFluxoChart(diagrama)
    }
  }, [entityInstance.id, diagrama])

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        disabled={!entityInstance.isUltimaVersao}
        titulo={id ? entityInstance.isUltimaVersao ? getMessage("linhaDeProducao.editar.label")  : getMessage("linhaDeProducao.visualizar.label") : getMessage("linhaDeProducao.cadastro.label")}
        onBack={"/cad/linhaDeProducao"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br/>
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={20}>
              {/* Role */}
              <InputAnt
                label={getMessage("linhaDeProducao.nome.label")}
                nomeAtributo="nome"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                onChange={e => setNome(e.target.value)}
                value={nome}
              />
            </Col>
            <Col span={4} className={"col-versao-form"}>
              {/* Role */}
              <span className={"label-versao"}>{getMessage("linhaDeProducao.versao.label")}</span>
                <Input
                    size={"large"}
                    value={entityInstance.versao}
                    message={getMessage("comum.obrigatorio.campo.message")}
                    disabled
                />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Droppable id="dr1" style={S.droppableStyle}>
                {listGrupoRecurso !== undefined && listGrupoRecurso.map(item =>
                  <Draggable
                    id={item.key}
                    style={{marginBottom: '8px', border: '1px solid #c7c7c7', borderRadius: 1, display: 'inline-block', marginRight: 4}}
                    type="left-right"
                    ports={{
                      port1: {
                        id: 'port1',
                        type: 'left',
                        position: {
                          x: -5.5,
                          y: 50,
                        },
                        properties: {
                          custom: {tipo: 'grupoRecurso'},
                          linkColor: '#F00',
                        },
                      },
                      port2: {
                        id: 'port2',
                        type: 'right',
                        properties: {
                          custom: {tipo: 'grupoRecurso'},
                          linkColor: '#000000',
                        },
                      },
                      port3: {
                        id: 'port3',
                        type: 'left',
                        position: {
                          x: -5.5,
                          y: 95,
                        },
                        properties: {
                          custom: {tipo: 'grupoRecurso'},
                          linkColor: '#F00',
                        },
                      },
                      port4: {
                        id: 'port4',
                        type: 'output',
                        properties: {
                          custom: {tipo: 'grupoRecurso'},
                          linkColor: '#001DBC'
                        },
                      },
                    }}
                    value={{value: item.value}}
                    position={{
                      x: '0',
                      y: '0',
                    }}
                    properties={{
                      custom: {
                        tipo: "grupoRecurso",
                        item,
                        grupoRecurso: {
                          listDefeitos: item.listDefeitos,
                        },
                        apontamentos: null
                      },
                      value: item.value,
                    }}
                  >
                    <S.Item>
                        {item.value}
                    </S.Item>
                  </Draggable>)}
              </Droppable>
            </Col>
          </Row>
          <Row gutter={24} style={{position: "relative"}}>
            <Col span={24} style={requiredLink.isGrupos || requiredLink.isDefeito ? {"max-height": "370px"} : {"max-height": "400px"}}>
              <PageContent onKeyDown={onkeydown}>{
                fluxoChart?.nodes &&
                <FluxoDeProcessos ref={fluxoRef} Components={Components} config={config} chart={fluxoChart}/>
              }
              </PageContent>
              {requiredLink.isGrupos &&
              <div style={{
                color: '#F00',
                fontSize: '12px'
              }}>{getMessage("linhaDeProducao.grupoRecurso.ligacao.grupos.required.label")}</div>}
              {requiredLink.isDefeito &&
              <div style={{
                color: '#F00',
                fontSize: '12px'
              }}>{getMessage("linhaDeProducao.grupoRecurso.ligacao.defeito.required.label")}</div>}
              {!requiredLink.isDefeito && !requiredLink.isGrupos &&
              <div style={{
                color: '#d9d9d9',
                fontSize: '12px'
              }}/>}
            </Col>
              <DeleteOutlined
                className={"iconDeleteOutlined"}
                onClick={() => deleteGroup()}
              />
          </Row>
        </Form>
      </Spin>
    </Col>
  );

  function onkeydown(event) {
    event.preventDefault()
    //propriedade.config.key = event.keyCode
  }

  function deleteGroup() {
    if (Object.values(fluxoChart.selected).length) {
      deleteKey()
      setFluxoChart(fluxoChart)
      fluxoRef.current.update()
    } else {
      Alert.error(getMessage("linhaDeProducao.grupoRecurso.requiredToDelete.label"));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.submit();
  }

  function handleReset() {
    form.resetFields();
  }

  function onFinish(values) {
    if (id) {
      values.id = id;
      validacao(values, 'editar');
    } else {
      validacao(values, 'salvar');
    }
  }

  function validacao(values, tipoFinalizar) {

    let arrayDefeitos = []
    let linksEditar = Object.values(fluxoChart.links)
    const nodesDiagrama = (Object.values(fluxoChart.nodes)).filter(item => item.properties.custom.tipo === "grupoRecurso")

    if (nodesDiagrama[0] === undefined) {
      Alerta.handleAlert("error", getMessage("linhaDeProducao.grupoRecurso.required.label"))
    } else {
      nodesDiagrama[0].properties.custom.item.flag = "true";

      const linksReprocessoValidador = linksEditar.filter(item => item.to.portId === "port3")

      linksReprocessoValidador.map(item => {
        if ((item.from !== undefined || item.from !== {}) && item.to.portId === "port3") {
          arrayDefeitos.push(item.from.nodeId.toString())
        }
      })

      if (arrayDefeitos.length > 0) {
        arrayDefeitos.forEach(item => item.toString())
      }

      const validarLinksDefeitos = Object.values(fluxoChart.nodes)
        .filter(item => item.properties.custom.tipo === 'defeito')
        .map(x => x.id.toString())
        .map(e => arrayDefeitos.includes(e))

      if (tipoFinalizar === 'salvar') {
        if ((!validarLinks.includes(false) || nodesDiagrama.length === 1) &&
          !validarLinksDefeitos.includes(false)) {
          setRequiredLink({color: '#d9d9d9', isDefeito: validarLinksDefeitos.includes(false), isGrupos: validarLinks.includes(false) && nodesDiagrama.length > 1})
          dispatch(linhaProducaoSalvarRequest(values, diagrama));
        } else {
          setRequiredLink({color: '#ff0000', isDefeito: validarLinksDefeitos.includes(false), isGrupos: validarLinks.includes(false)})
        }
      } else if (tipoFinalizar === 'editar') {

        let array = []

        const linksValidadores = linksEditar.filter(item => item.to.portId === "port1" || item.from.portId === "port2")

        linksValidadores.map(item => {
          if (item.to !== undefined || item.to !== {}) {
            array.push(item.to.nodeId.toString())
          }
          if (item.from !== undefined || item.from !== {}) {
            array.push(item.from.nodeId.toString())
          }
        })
        if (array.length > 0) {
          array.forEach(item => item.toString())
        }

        validarLinks = nodesDiagrama.map(item => array.includes(item.id.toString()))

        if ((!validarLinks.includes(false) || nodesDiagrama.length === 1) &&
          !validarLinksDefeitos.includes(false)) {
          dispatch(linhaProducaoEditarRequest(values, fluxoChart));
          setDiagramaID(fluxoChart)
        } else {
          setRequiredLink({color: '#F00', isGrupos: validarLinks.includes(false), isDefeito: validarLinksDefeitos.includes(false)})
        }
      }
    }

  }

  function deleteKey(node = null) {
    if (node) {
    if (fluxoChart.selected !== {} && fluxoChart.selected.type === 'link') {
      chart.selected = {}
    }
    const defeito = Object.values(fluxoChart.nodes).filter(item => item.properties.custom.tipo === 'defeito')

    if (Object.values(fluxoChart.selected).length < 2) {
      if (node.id) {
        var node_1 = fluxoChart.nodes[node.id];

        if (node_1.readonly) {
          return fluxoChart;
        }
        // Delete the connected links
        Object.keys(fluxoChart.links).forEach(function (linkId) {
          var link = fluxoChart.links[linkId];
          if (link.from.nodeId.toString() === node_1.id.toString() ||
            link.to.nodeId.toString() === node_1.id.toString()) {
            delete fluxoChart.links[link.id];
          }
          if (link.hasOwnProperty("properties") && node_1.id === link.properties.grupoRecursoId) {
            delete fluxoChart.links[link.id];
          }
        });

        // Delete the node
        delete fluxoChart.nodes[node.id];
        defeito.map(item => {
          if (item.properties.custom.grupoRecursoId === node.id) {
            delete fluxoChart.nodes[item.id]
          }
        })
        delete fluxoChart.selected[node.id]
      }

        if (fluxoChart.selected.type === 'link' && fluxoChart.selected.id) {
          delete fluxoChart.links[chart.selected.id];
        }
      }
      return fluxoChart;
    } else {
      Object.values(fluxoChart.selected).map(item => {
        if (item.type === 'node' && item.id) {
          var node_1 = fluxoChart.nodes[item.id];

          // Delete the connected links
          Object.keys(fluxoChart.links).forEach(function (linkId) {
            var link = fluxoChart.links[linkId];
            if (link.from.nodeId.toString() === node_1.id.toString() ||
              link.to.nodeId.toString() === node_1.id.toString()) {
              delete fluxoChart.links[link.id];
            }
            if (link.hasOwnProperty("properties") && node_1.id === link.properties.grupoRecursoId) {
              delete fluxoChart.links[link.id];
            }
          });

          // Delete the node
          delete fluxoChart.nodes[item.id];
          if (item.defeitos) {
            item.defeitos.map(item => delete fluxoChart.nodes[item.id])
          }
          delete fluxoChart.selected[item.id]
        }
      })
      return fluxoChart;
    }
  };

})
