import api from "./api";

export const ServiceLinhaDeProducao = {
  listar: filtros => {
    return api.get("/linhaDeProducao",
      { params: { ...filtros }}
      ).then(response => {
        const entities = response.entities.map(entity => ({
           ...entity
        }));
        return { ...response, entities };
      })
  },
  novo: () => {
    return api.get("/linhaDeProducao/prepareNew");
  },
  salvar: ({ entity, diagrama }) => {

    const resultado = armazenarDados(diagrama, "salvar")

    return api.post("/linhaDeProducao",{
      ...entity,
      processos:
        resultado.processosGrupoRecurso.map((item,index) => {
          if(item.properties.custom.tipo === "grupoRecurso"){
            return{
              grupoRecurso: item.id,
              numeroMaximoDeApontamentos: item.properties.custom.apontamentos,
              ordem: index,
              reprocessos: resultado.processos.filter(x => item.id === x.processoInicial)
                .map(elemento => {
                   return{
                     defeito: elemento.defeito,
                     ordemProcessoRetorno: elemento.ordemProcessoRetorno
                }})
        }}}),
    })
  },
  deletar: id => {
    return api.delete(`/linhaDeProducao/${id}`)
  },
  prepararEditar: id => {
    return api.get("/linhaDeProducao/prepareEdit", {
      params: { id }
    })
  },
  editar: ( {entity, diagrama} ) => {

    const resultado = armazenarDados(diagrama, "editar")

    return api.put(`/linhaDeProducao/${entity.id}`,{
    ...entity,
      processos:
        resultado.processosGrupoRecurso.map((item,index) => {
          return{
            grupoRecurso: item.id,
            numeroMaximoDeApontamentos: item.properties.custom.apontamentos,
            ordem: index,
            reprocessos: resultado.processos.filter(x => item.id === x.processoInicial)
              .map(elemento => {
                 return{
                   defeito: elemento.defeito,
                   ordemProcessoRetorno: elemento.ordemProcessoRetorno
              }})
          }
        })
    })
  },
  buscarLinhaProducaoPorNome: nome => {
    return api.get("/linhaDeProducao/buscarLinhaProducaoPorNome", {params: {nome}})
  },
  restaurarLinhaProducao: id => {
    return api.post(`/linhaDeProducao/restaurarLinhaProducao`, {id})
  },
  afterSaveEdit: ({entity}) => {
    const {id, nome} = entity
    return api.get(`/linhaDeProducao/afterSaveEdit`, {
      params: { id, nome }
    })
  },

  ativarDesativar: id => {
    return api.patch("/linhaDeProducao/ativarOuDesativar", {
      id
    });
  },
}

const armazenarDados = (diagrama, tipo) => {
    const values = Object.values(diagrama.nodes).sort((a,b) => a.position.x - b.position.x)
    const links = Object.values(diagrama.links)
    const processosOrigem = []
    const processosRetorno = []
    let processos
  console.log(diagrama)

    links.map(item => {
      if(item.from.portId === 'port4' || item.from.portId === 'port3'){
        processosOrigem.push({
          processoOrigem: Number(item.properties.grupoRecursoId),
          defeito: Number(item.properties.defeitoId),
        })
      }
      if(item.to.portId === 'port3'){
        processosRetorno.push({
          processoRetorno: Number(item.to.nodeId),
          defeito: Number(item.properties.defeitoId),
          processoOrigem: Number(item.properties.grupoRecursoId),
        })
      }
    })

  console.log(processosOrigem)
  console.log(processosRetorno)

    if(tipo === 'salvar'){
      processos = processosOrigem.map(item => {
      for (let i of processosRetorno) {
        if(i.defeito === item.defeito && i.processoOrigem === item.processoOrigem) {
          return {
            processoInicial: item.processoOrigem,
            defeito: i.defeito,
            processoRetorno: i.processoRetorno,
            ordemProcessoRetorno: ''
          }
        }
      }
    })
    }else {
      processos = processosOrigem.map((item, index) => {
        for (let i of processosRetorno) {
          if(i.defeito === item.defeito && i.processoOrigem === item.processoOrigem) {
            return {
              processoInicial: item.processoOrigem,
              defeito: i.defeito,
              processoRetorno: i.processoRetorno,
              ordemProcessoRetorno: ''
            }
          }
        }
      })
    }

    const processosGrupoRecurso = values.filter(item => {
      if(item.properties.custom.tipo === "grupoRecurso"){
        return item
      }
    });
    console.log(processos)

    processosGrupoRecurso.map((item, index) => {
      processos.map(elemento => {
        if(elemento.processoRetorno === item.id){
            elemento.ordemProcessoRetorno = index
      }})
    })

    return {
      processosGrupoRecurso,
      processos
    }
}
