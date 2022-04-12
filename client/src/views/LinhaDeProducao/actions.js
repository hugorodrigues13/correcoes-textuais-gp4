import {v4} from "uuid";
import AlertDismissable from "../../components/AlertDismissable";
import React from "react";
import Alert from "react-s-alert";

export const onCanvasDrop = function (_a) {
  const config = _a.config, data = _a.data, position = _a.position, id = _a.id;
  const {primeiroDaLinha} = data.properties.custom.item;

  return function (chart) {
    const objeto = Object.values((chart.nodes)).map(elemento => elemento.id).filter(item => item === id)

    const obj = Object.values(chart.nodes);

    if (!objeto.includes(id)) {
      chart.nodes[id] = {
        id: id,
        position: config && config.snapToGrid
          ? {
            x: position.x,
            y: 40,
          }
          : {x: position.x, y: 40},
        orientation: data.orientation || 0,
        type: data.type,
        ports: data.ports,
        properties: data.properties,
      };

        (_a.data.properties.custom.grupoRecurso.listDefeitos || []).map((item, index) => {
          const defeitoId = v4();

          chart.nodes[defeitoId] = {
            id: defeitoId,
            position: config && config.snapToGrid
              ? {
                x: position.x-(index*5),
                y: (120 * (index + 1)),
              }
              : {x: position.x-(index*5), y: 120 + (100 * (index + 1))},
            orientation: data.orientation || 0,
            type: data.type,
            ports: {
              port1: {
                id: 'port1',
                type: 'left',
                properties: {
                  custom: {tipo: 'defeito'},
                  linkColor: '#FF8000',
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
              port3: (index === _a.data.properties.custom.grupoRecurso.listDefeitos.length-1) ?
                {
                  id: '',
                  type: '',
                  properties: {
                  },
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
              custom: {tipo: "defeito", grupoRecursoId: id, defeitoId: item.id},
              value: item.nome,
            },
          }
          if(index === 0){
            const linkDefeitoId = v4()
            chart.links[linkDefeitoId] = {
              from: {nodeId: id, portId: "port4"},
              id: `${linkDefeitoId}`,
              properties: {
                grupoRecursoId: id, defeitoId: item.id, tipoLink: "readOnly"
              },
              to: {nodeId: `${defeitoId}`, portId: "port2"}
            }
          } else {
            for(let i of _a.data.properties.custom.grupoRecurso.listDefeitos){
              if(index-1 === _a.data.properties.custom.grupoRecurso.listDefeitos.indexOf(i)){

                const proximoDefeitoId = (Object.values(chart.nodes).filter(elemento => elemento.properties.custom.defeitoId === i.id && elemento.properties.custom.grupoRecursoId === id)).map(x => x.id)
                let linkDefeitoId = v4()

                chart.links[linkDefeitoId] = {
                  id: `${linkDefeitoId}`,
                  from:{
                    nodeId: `${proximoDefeitoId}`,
                    portId: "port3"
                  },
                  properties: {
                    grupoRecursoId: id, defeitoId: item.id, tipoLink: "readOnly"
                  },
                  to:{
                    nodeId: `${defeitoId}`,
                    portId: "port2"
                  }
                }
              }
            }
          }
        })
      }
      return chart;
    };
};

export const onCanvasClick = function (){
  return function (chart) {
    if (chart.selected.id) {
      chart.selected = chart;
    }
    return chart;
  };
};

export const onNodeClick = function (_a) {
  var nodeId = _a.nodeId;
  const select = []
  const selectLink = []
  const SELECAO = {INSERIR: "selecao", REMOVER: "removerSelecao"}
  return function (chart) {

    const itemSelecionado = Object.values(chart.selected).find(item => item.id === nodeId)

    if(itemSelecionado !== undefined && itemSelecionado.hasOwnProperty("defeitos")){
      itemSelecionado.defeitos.map(item => delete chart.selected[item.id])
      Object.values(chart.links).map(elemento => {
        if(elemento.from.nodeId.toString() === nodeId.toString() || elemento.to.nodeId.toString() === nodeId.toString()){
          selectLink.push({id: elemento.id,type: 'link',})
          selectLink.forEach(item => delete chart.selected[item.id])
        }
      })

      delete chart.selected[nodeId]


      return chart;
    } else if(itemSelecionado !== undefined && itemSelecionado.type === "defeito"){

      delete chart.selected[itemSelecionado.id]

      selecaoLinksDoNode(chart, nodeId, SELECAO.REMOVER)

      return chart;
    } else {
      if (Object.values(chart.nodes).find(x => x.id === nodeId) !== undefined &&
          Object.values(chart.nodes).find(x => x.id === nodeId).properties.custom.tipo === "defeito"){
        chart.selected[nodeId] = { id: nodeId, type: "defeito" }

        selecaoLinksDoNode(chart, nodeId, SELECAO.INSERIR)

        return chart;
      } else if (chart.selected.id !== nodeId || chart.selected.type !== 'node') {
        Object.values(chart.nodes).map(item => {
          if (item.properties.custom.grupoRecursoId &&
            item.properties.custom.grupoRecursoId === nodeId) {
            select.push({type: 'node', id: item.id})
            chart.selected[item.id] = {
              id: item.id,
              type: "defeito",
            }
          }
        })

        const nodes = Object.values(chart.nodes).map(item => item.id)

        Object.values(chart.selected).map(elemento =>{
          if(!nodes.includes(elemento.id)) {
            delete chart.selected[elemento.id]
        }})

        const nodeClick = Object.values(chart.nodes).find(x => x.id === nodeId)

        selecaoLinksDoNode(chart, nodeId, SELECAO.INSERIR)

        if (nodeClick === undefined || nodeClick.hasOwnProperty("properties") && nodeClick.properties.custom.tipo === "defeito"){
          return chart;
        } else{
          chart.selected[nodeId] = {
            type: 'node',
            id: nodeId,
            defeitos: select,
          };
        }
      }

      return chart;
  }};
};

export const onDeleteKey = function (_a) {
  var config = _a.config;
  return function (chart) {
    if (config.readonly) {
      return chart;
    }

    //backspace
    if (config.key === 8){
      return chart;
    }

    Object.values(chart.selected).map(item => {
      if (item.type === 'node' && item.id) {
        var node_1 = chart.nodes[item.id];

        // Delete the connected links
        Object.keys(chart.links).forEach(function (linkId) {
          var link = chart.links[linkId];
          if (link.from.nodeId.toString() === node_1.id.toString() ||
              link.to.nodeId.toString() === node_1.id.toString() ) {
            delete chart.links[link.id];
          }
          if (link.hasOwnProperty("properties") && node_1.id === link.properties.grupoRecursoId){
            delete chart.links[link.id];
          }
        });

        // Delete the node
        delete chart.nodes[item.id];
        if(item.defeitos){
          item.defeitos.map(item => delete chart.nodes[item.id])
        }
        delete chart.selected[item.id]
      }
    })

    Object.values(chart.selected).map(item => {
      if(item.type === "link"){
        const linkSelected = Object.values(chart.links).find(x => x.id === item.id)
        if( linkSelected !== undefined && (!linkSelected.properties.hasOwnProperty('tipoLink') ||
            (linkSelected.properties.hasOwnProperty('tipoLink') &&
            linkSelected.properties.tipoLink !== 'readOnly'))){
          delete chart.links[item.id];
          delete chart.selected[item.id];
        }
      }
    })

    return chart;
  };
};

export const onDragNode = function (_a) {
  var config = _a.config, event = _a.event, data = _a.data, id = _a.id;
  return function (chart) {
    if(chart.selected !== {} && chart.selected.type === 'link'){
      chart.selected = {}
    }
    if(Object.values(chart.selected).length < 1){
      var nodechart = chart.nodes[id];
        if (nodechart) {
          //REMOVER LINKS DE REPROCESSOS E PROCESSOS LIGADOS A PROCESSOS POSTERIORES (sem seleção de grupo recurso)
          Object.values(chart.links).map(link => {
            if((link.to.portId === 'port3' && link.to.nodeId.toString() === nodechart.id.toString())
            || (link.from.portId === 'port2' && link.from.nodeId.toString() === nodechart.id.toString())
            || (link.from.portId === 'port1' && link.properties.grupoRecursoId.toString() === nodechart.id.toString())
            ){
              Object.values(chart.nodes).map(node => {
                if ((link.from.portId === 'port1' || (link.from.portId === 'port2' && link.to.portId === 'port1'))
                    && node.position.x > nodechart.position.x &&
                    (link.from.nodeId.toString() === node.id.toString()
                    || link.to.nodeId.toString() === node.id.toString())
                    && chart.nodes[link.from.nodeId].properties.custom.grupoRecursoId === nodechart.id) {
                  delete chart.links[link.id]
                  if(chart.selected[link.id]){
                    delete chart.selected[link.id]
                  }
                }
                if(node.position.x < nodechart.position.x &&
                   (link.from.nodeId.toString() === node.id.toString()
                   || link.to.nodeId.toString() === node.id.toString() )) {
                  if((link.properties.hasOwnProperty("grupoRecursoId")
                    && link.properties.grupoRecursoId !== undefined
                    && link.properties.grupoRecursoId.toString() !== nodechart.id.toString()) ||
                    (link.properties.hasOwnProperty("label")
                    && link.properties.label === "linkGrupoRecurso") ||
                    link.properties.grupoRecursoId === undefined) {
                    delete chart.links[link.id]
                    if(chart.selected[link.id]){
                      delete chart.selected[link.id]
                    }
                  }
                }
              })
            }
          })

          var delta = {
            x: data.deltaX,
            y: data.deltaY,
          };
          chart.nodes[id] = Object.assign({}, nodechart, {
            position: {
              x: nodechart.properties.custom.tipo === "defeito" ? nodechart.position.x : nodechart.position.x + delta.x,
              y: nodechart.position.y,
            }
          });
        }

        (Object.values(chart.nodes)).map(item => {
          if (item.properties.custom.grupoRecursoId === id) {
            nodechart = chart.nodes[item.id]
            chart.nodes[item.id] = Object.assign({}, nodechart, {
              position: {
                x: nodechart.position.x + delta.x,
                y: nodechart.position.y,
              }
            });
          }
        })
        return chart;
    } else{
      const objSelecionado = Object.values(chart.selected).find(item => item.id === id)

      if(objSelecionado === undefined){
        var nodechart = chart.nodes[id];
        if (nodechart) {
          var delta = {
            x: data.deltaX,
            y: data.deltaY,
          };
          chart.nodes[id] = Object.assign({}, nodechart, {
            position: {
              x: nodechart.properties.custom.tipo === "defeito" ? nodechart.position.x : nodechart.position.x + delta.x,
              y: nodechart.position.y,
            }
          });
        }

        (Object.values(chart.nodes)).map(item => {
          if (item.properties.custom.grupoRecursoId === id) {
            nodechart = chart.nodes[item.id]
            chart.nodes[item.id] = Object.assign({}, nodechart, {
              position: {
                x: nodechart.position.x + delta.x,
                y: nodechart.position.y,
              }
            });
          }
        })
      }

      Object.values(chart.selected).map(elemento => {
        var nodechart = chart.nodes[elemento.id];

        if (nodechart) {
          var delta = {
            x: data.deltaX,
            y: data.deltaY,
          };
          chart.nodes[elemento.id] = Object.assign({}, nodechart, {
            position: {
              x: nodechart.properties.custom.tipo === "defeito" ? nodechart.position.x : nodechart.position.x + delta.x,
              y: nodechart.position.y,
            }
          });
        }

        (Object.values(chart.nodes)).map(item => {
          if (item.properties.custom.grupoRecursoId === elemento.id) {
            nodechart = chart.nodes[item.id]

            chart.nodes[item.id] = Object.assign({}, nodechart, {
              position: {
                x: nodechart.position.x + delta.x,
                y: nodechart.position.y,
              }
            });
          }
        })

        return chart;
      })

      //REMOVER LINKS DE REPROCESSOS E PROCESSOS LIGADOS A PROCESSOS POSTERIORES (com seleção de grupo recurso)
      Object.values(chart.links).map(link => {
      let positionNode1
      let positionNode2
        if(link.to.portId === 'port3' || link.from.portId === 'port2') {
          Object.values(chart.nodes).map(node => {
            if(chart.nodes[link.from.nodeId].properties.custom.tipo === 'defeito'){
              positionNode1 = chart.nodes[link.from.nodeId].properties.custom.grupoRecursoId
              positionNode1 = chart.nodes[positionNode1]
            } else if (chart.nodes[link.from.nodeId].properties.custom.tipo === 'grupoRecurso'){
              positionNode1 = chart.nodes[link.from.nodeId]
            }
            if(chart.nodes[link.to.nodeId].properties.custom.tipo === 'defeito'){
              positionNode2 = chart.nodes[link.to.nodeId].properties.custom.grupoRecursoId
              positionNode2 = chart.nodes[positionNode2]
            } else if (chart.nodes[link.to.nodeId].properties.custom.tipo === 'grupoRecurso'){
              positionNode2 = chart.nodes[link.to.nodeId]
            }

            if (link.from.portId === 'port2' && positionNode1.position.x > positionNode2.position.x){
              delete chart.links[link.id]
              if(chart.selected[link.id]){
                delete chart.selected[link.id]
              }
            }
            else if (link.to.portId === 'port3' && positionNode1.position.x < positionNode2.position.x){
              delete chart.links[link.id]
              if(chart.selected[link.id]){
                delete chart.selected[link.id]
              }
            }
          })
        }
      })

      return chart
    }
  };
};

export const onLinkComplete = function (props) {
  var linkId = props.linkId, fromNodeId = props.fromNodeId, fromPortId = props.fromPortId, toNodeId = props.toNodeId,
    toPortId = props.toPortId, _a = props.config, config = _a === void 0 ? {} : _a;
  return function (chart) {
    const links = Object.values(chart.links).map(item => item.from.portId === fromPortId && item.from.nodeId === fromNodeId).filter(elemento => elemento === true)
    if(links.length < 2){
      if (!config.readonly &&
        (config.validateLink ? config.validateLink(Object.assign({}, props, { chart: chart })) : true) &&
        [fromNodeId, fromPortId].join() !== [toNodeId, toPortId].join()) {
        chart.links[linkId].to = {
          nodeId: toNodeId,
          portId: toPortId,
        };
        const grupoRecurso = Object.values(chart.nodes).find(item => item.id === fromNodeId)
        chart.links[linkId].properties = {
          grupoRecursoId: grupoRecurso.properties.custom.grupoRecursoId,
          defeitoId: grupoRecurso.properties.custom.defeitoId
        };
      }else {
        delete chart.links[linkId];
      }
    }
    else {
      delete chart.links[linkId];
    }
    return chart;
  };
};

export const onNodeDoubleClick = function (_a) {
    var nodeId = _a.nodeId;
    return function (chart) {
      Object.values(chart.selected).map(item => delete chart.selected[item.id])

      return chart;
    };
};

export const onLinkClick = function (_a) {
    var linkId = _a.linkId;
    return function (chart) {
      const linkSelecionado = Object.values(chart.selected).find(item => item.id === linkId)

      if (linkSelecionado === undefined) {
          chart.selected[linkId] = {
              type: 'link',
              id: linkId,
          };
      } else {
        delete chart.selected[linkId]
      }

      return chart;
    };
};

const selecaoLinksDoNode = (chart, nodeId, acao) => {
  const selectLink = []

  Object.values(chart.links).map(elemento => {
    if(elemento.from.nodeId.toString() === nodeId.toString() || elemento.to.nodeId.toString() === nodeId.toString()){

      selectLink.push({id: elemento.id,type: 'link',})
    }
  })

  if(acao === "selecao"){
    selectLink.forEach(item => chart.selected[item.id] = {id: item.id, type: "link"})
  } else if(acao === "removerSelecao"){
    selectLink.forEach(item => delete chart.selected[item.id])
  }
}

export const validateLink = ({linkId, fromNodeId, fromPortId, toNodeId, toPortId, chart}) => {
  // no links between same type nodes
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'defeito' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'defeito' &&
    (chart.nodes[fromNodeId].properties.custom.grupoRecursoId !== chart.nodes[toNodeId].properties.custom.grupoRecursoId ||
      toPortId === 'port1' || toPortId === 'port2' || toPortId === 'port3')) return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'grupoRecurso' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'defeito') return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'defeito' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'grupoRecurso' &&
    fromPortId === 'port2') return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'defeito' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'grupoRecurso' &&
    (toPortId === 'port1' || toPortId === 'port2' || toPortId === 'port4')) return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'defeito' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'grupoRecurso' &&
    fromPortId === 'port3' && toPortId === 'port3') return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'grupoRecurso' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'grupoRecurso' &&
    (toPortId === 'port3' || fromPortId === 'port1' || fromPortId === 'port3' || fromPortId === 'port4')) return false
  if (chart.nodes[fromNodeId].properties.custom.tipo === 'defeito' &&
    chart.nodes[toNodeId].properties.custom.tipo === 'grupoRecurso' &&
    chart.nodes[chart.nodes[fromNodeId].properties.custom.grupoRecursoId].position.x < chart.nodes[toNodeId].position.x
  )return false
  return true
}

export const criarLinkDefeito = (defeito, grupo, chart) => {
  const id = v4()
  chart.links[id] = {
    id,
    from: {
      nodeId: defeito.id,
      portId: 'port1',
    },
    to: {
      nodeId: grupo.id,
      portId: 'port3',
    },
    properties: {
      grupoRecursoId: defeito.properties.custom.grupoRecursoId,
      defeitoId: defeito.properties.custom.defeitoId,
    },
  }
}

export const deletarLinksDefeitoAntigo = (defeito, grupo, chart) => {
  const links = Object.values(chart.links).filter(link => link.from.nodeId === defeito.id)
  links.forEach(link => {
    delete chart.links[link.id]
  })
}
