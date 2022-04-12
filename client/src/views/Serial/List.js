import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {Button, Checkbox, Col, Modal, PageHeader, Popconfirm, Popover, Row, Spin, Tooltip} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {
  buscaValoresIniciaisRequest,
  folhaImpressaoDataRequest,
  listSerialHistoricoRequest,
  listSerialRequest,
  serialEstornarApontamentoRequest, serialExportarRequest,
  serialGerarEtiquetaRequest, serialSucatearRequest,
} from "../../store/modules/Serial/action";
import {getMessage} from "../../components/messages";
import {ExclamationCircleFilled} from "@ant-design/icons";
import FiltroAtivavel from "../../components/FiltroAtivavel";
import ImpressaoModal from "./ImpressaoModal";
import SerialModal from "./SerialModal";
import {RiFileTextLine} from "react-icons/all";
import * as queryString from "query-string";
import FolhaImpressaoModal from "../OrdemDeFabricacao/FolhaImpressaoModal";

class List extends React.Component {

    statusProp = {
        mode: 'multiple',
        maxTagCount: 1,
        allowClear: false,
    }

    selectTags = {
        mode: 'tags',
        maxTagCount: 1,
        tokenSeparators: [',', ' '],
        allowClear: false
    }

    state = {
      openModalFolhaImpressao: false,
        reimpressaoState: false,
        impressaoModal: false,
        impressaoSeriais: [],
        impressaoSerialOF: null,
        serialAberto: null,
        entity: [],
        selectedRowsImpressao: [],
        etiqueta: null,
        totalCount: 0,
        visible: false,
        nomeDoSerial: "",
        filterComp: {
            labelCol: {style: {lineHeight: 1}},
            margin: {marginTop: '10px'},
            layout: "vertical",
            prefix: "serial",
            campos: [
                {
                    key: "serial",
                    nome: "serial",
                    value: getMessage("serial.serial.label"),
                    tipo: "select",
                    tratamento: true,
                    visible: true,
                    isSorteable: true,
                    props: this.selectTags
                },
                {
                    key: "codigoOrigem",
                    nome: "codigoOrigem",
                    value: getMessage("serial.codigoOrigem.label"),
                    tipo: "text",
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "codigoGerado",
                    nome: "codigoGerado",
                    value: getMessage("serial.codigoGerado.label"),
                    tipo: "text",
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "codigoProduto",
                    nome: "codigoProduto",
                    value: getMessage("serial.codigoProduto.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    width: '10%',
                    isSorteable: true
                },
                {
                    key: "descricaoProduto",
                    nome: "descricaoProduto",
                    value: getMessage("serial.descricaoProduto.label"),
                    tipo: "text",
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "ordemFabricacao",
                    nome: "ordemFabricacao",
                    value: getMessage("serial.ordemFabricacao.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    width: '10%',
                    isSorteable: true
                },
                {
                    key: "ordemProducao",
                    nome: "ordemProducao",
                    value: getMessage("serial.ordemProducao.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    width: '10%',
                    isSorteable: true
                },
                {
                    key: "lote",
                    nome: "lote",
                    value: getMessage("serial.lote.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "caixa",
                    nome: "caixa",
                    value: getMessage("serial.caixa.label"),
                    tipo: "text",
                    visible: false,
                    isSorteable: true
                },
                {
                    key: "linhaProducao",
                    nome: "linhaProducao",
                    value: getMessage("serial.linhaProducao.label"),
                    tipo: "text",
                    visible: false,
                    isSorteable: true
                },
                {
                    key: "grupoLinhaProducao",
                    nome: "grupoLinhaProducao",
                    value: getMessage("serial.grupoLinhaProducao.label"),
                    tipo: "text",
                    visible: false,
                    width: '10%',
                    isSorteable: true
                },
                {
                    key: "status",
                    nome: "status",
                    value: getMessage("serial.status.label"),
                    tipo: "select",
                    ordenar: true,
                    tratamento: true,
                    render: this.getStatus,
                    visible: true,
                    isSorteable: true,
                    props: this.statusProp
                },
                {
                    key: "statusOrdemFabricacao",
                    nome: "statusOrdemFabricacao",
                    value: getMessage("serial.statusOrdemFabricacao.label"),
                    tipo: "select",
                    ordenar: true,
                    tratamento: true,
                    render: this.getStatusOrdemFabricacao,
                    visible: true,
                    props: this.statusProp,
                    isSorteable: true
                },
              {
                key: "statusLote",
                nome: "statusLote",
                value: getMessage("serial.statusLote.label"),
                tipo: "select",
                ordenar: true,
                tratamento: true,
                render: this.getStatusLote,
                visible: true,
                props: this.statusProp,
                isSorteable: true
              },
                {
                    key: "statusImpressaoEtiqueta",
                    nome: "statusImpressaoEtiqueta",
                    value: getMessage("serial.statusImpressaoEtiqueta.label"),
                    tipo: "select",
                    ordenar: true,
                    tratamento: true,
                    render: this.getEtiquetaJaFoiImpressa,
                    visible: true,
                    props: this.statusProp,
                },
                {
                    key: "dataFinalizacao",
                    nome: "dataFinalizacao",
                    value: getMessage("serial.dataFinalizacao.label"),
                    tipo: "rangeDate",
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "ultimoApontamento",
                    nome: "ultimoApontamento",
                    value: getMessage("serial.ultimoApontamento.label"),
                    tipo: "rangeDate",
                    dateFormat: "DD/MM/YYYY HH:mm:ss",
                    format: 'HH:mm:ss',
                    showTime: true,
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "dataRomaneio",
                    nome: "dataRomaneio",
                    value: getMessage("serial.dataRomaneio.label"),
                    tipo: "rangeDate",
                    dateFormat: "DD/MM/YYYY HH:mm:ss",
                    format: 'HH:mm:ss',
                    showTime: true,
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "dataSucateamento",
                    nome: "dataSucateamento",
                    value: getMessage("serial.dataSucateamento.label"),
                    tipo: "rangeDate",
                    dateFormat: "DD/MM/YYYY HH:mm:ss",
                    format: 'HH:mm:ss',
                    showTime: true,
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "codigoRomaneio",
                    nome: "codigoRomaneio",
                    value: getMessage("serial.codigoRomaneio.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    isSorteable: true
                },
                {
                    key: "statusRomaneio",
                    nome: "statusRomaneio",
                    value: getMessage("serial.statusRomaneio.label"),
                    tipo: "select",
                    ordenar: true,
                    tratamento: true,
                    render: this.getStatusRomaneio,
                    visible: true,
                    props: this.statusProp,
                    isSorteable: true
                },
                {
                    key: "statusWip",
                    nome: "statusWip",
                    value: getMessage("serial.statusWip.label"),
                    tipo: "select",
                    ordenar: true,
                    tratamento: true,
                    render: this.getStatusWip,
                    visible: true,
                    props: this.statusProp,
                    isSorteable: true
                },
                {
                    key: "codigoNF",
                    nome: "codigoNF",
                    value: getMessage("serial.codigoNF.label"),
                    tipo: "select",
                    props: this.selectTags,
                    visible: true,
                    isSorteable: true
                },
            ]
        },
        filtros: {
            statusOrdemFabricacao: "",
            descricaoProduto: "",
            linhaProducao: "",
            grupoLinhaProducao: "",
            status: "",
            dataFinalizacao: "",
            statusRomaneio: "",
            paginacao: {
                offset: 0,
                max: 10
            },
            ordenacao: {
                sort: "",
                order: ""
            }
        }
    };

    render() {
        const {loading} = this.props.requestManager;
        const {data, historico} = this.props.serial;
        const {campos} = this.state.filterComp;
        const lista = {
            ...data,
            status: (data.statusList || []).map((item) => ({
                key: item,
                nome: this.getMessage(`serial.status.${item}.label`)
            })),
            statusOrdemFabricacao: (data.statusOrdemFabricacaoList || []).map((item) => ({
                key: item,
                nome: this.getMessage(`ordemFabricacao.filtro.status.${item}.label`)
            })),
          statusLote: (data.statusLoteList || []).map((item) => ({
            key: item,
            nome: this.getMessage(`serial.filtro.status.lote.${item}.label`)
          })),
            statusRomaneio: (data.statusRomaneioList || []).map((item) => ({
                key: item,
                nome: this.getMessage(`serial.filtro.status.${item}.label`)
            })),
            statusWip: (data.statusWipList || []).map((item) => ({
                key: item,
                nome: this.getMessage(`serial.filtro.statusWip.${item}.label`)
            })),
            statusImpressaoEtiqueta: (data.statusImpressaoEtiqueta || []).map((item) => ({
                key: item,
                nome: this.getMessage(`serial.filtro.statusImpressaoEtiqueta.${item}.label`)
            })),
        };

        return (
            <>
                <PageHeader
                    title={<FormattedMessage id={"serial.listagem.label"}/>}
                    extra={
                        <Tooltip title={getMessage("serial.exportar.tooltip.label")}>
                            <Button
                                onClick={this.exportarSeriais}
                                type="default"
                                className="page-header-ignored-button">
                                <RiFileTextLine fontSize="1.5em"/>
                            </Button>
                        </Tooltip>
                    }
                />

                <Filter
                    filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
                    filtros={this.state.filtros}
                    handlePesquisar={this.handlePesquisar}
                    mapPropsToFields={this.mapPropsToFields()}
                    data={lista}

                />
                <br/>
                <Row gutter={24} className={"table-header-row"}>
                    <Col md={20}>
                        <FiltroAtivavel
                            tipo="SERIAIS"
                            setVisible={this.setVisible}
                            campos={campos}
                            selecionarTodos={true}
                            toggleAll={this.toggleAll}
                        />
                    </Col>
                </Row>
                {this.state.reimpressaoState ?
                    <div>
                        {this.seriaisSaoMesmaOrdemFabricacao()
                            ? <Button size="medium" htmlType="submit" type="primary"
                                      onClick={() => this.reimpressao(this.state.selectedRowsImpressao)}>
                                <FormattedMessage id={"comum.reimpressao.label"}/>
                            </Button>
                            : <span style={{color: 'rgba(255,0,0,.8)', padding: '5px'}}>
                <ExclamationCircleFilled/> {getMessage("serial.reimpressao.mesmoordemfabricacao")}
              </span>
                        }
                    </div>
                    : null}

                <br/>
                <TabelaAnt configTable={this.configTable()} loading={loading}/>
                <ImpressaoModal visible={this.state.impressaoModal}
                                setVisible={(b) => this.setState({impressaoModal: b})}
                                seriais={this.state.impressaoSeriais}
                                ordemFabricacao={this.state.impressaoSerialOF}
                />
                <SerialModal
                    serial={this.state.serialAberto?.serial}
                    id={this.state.serialAberto?.id}
                    visible={this.state.visible}
                    setVisible={(b) => this.setState({visible: b})}
                    loading={loading}
                    getFiltros={this.getFiltros}
                />
              <FolhaImpressaoModal
                visible={this.state.openModalFolhaImpressao}
                setVisible={(b) => this.setState({openModalFolhaImpressao: b})}
                data={{...this.props.serial.folhaImpressao?.entity, id: this.state.folhaParaImprimir?.id} || {}}
                imprimirFolha={null}
                loading={loading}
              />
            </>
        )
    }

    toggleAll = (visible) => {
        this.setState({
            filterComp: {
                ...this.state.filterComp, campos: this.state.filterComp.campos.map((c, idx) => {
                    return {...c, visible: visible || idx === 0} //sempre deixar uma coluna visivel
                })
            }
        })
    }

    exportarSeriais = () => {
        this.props.serialExportarRequest({
            ...this.getFiltros(),
            colunas: this.state.filterComp.campos.filter(c => c.visible).map(c => c.key)
        })
    }

    setVisible = (column) => {
        if (!column.visible || this.state.filterComp.campos.filter(c => c.visible).length > 1) {
            this.setState({
                filterComp: {
                    ...this.state.filterComp, campos: this.state.filterComp.campos.map(c => {
                        if (c.key === column.key) {
                            c.visible = !c.visible
                        }
                        return c
                    })
                }
            })
        }
    };

  async componentDidMount() {
    document.title = this.getMessage("serial.title.label");
    await this.checarParametros(['codigoProduto', 'lote']);
    this.getValoresIniciais();
  }

  checarParametros = async (props) => {
    const params = queryString.parse(this.props.location.search);
    if (props.some(prop => params[prop])) {
      let state = this.state
      for (const prop of props) {
        const coluna = this.state.filterComp.campos.find(c => c.key === prop);
        this.setVisible(coluna)
        state = {...state, filtros: {...state.filtros, [prop]: params[prop]}}
      }

      await this.setState(state)
    }
  }

    showModal = (entity) => {
        this.props.listSerialHistoricoRequest(entity.id)
        this.setState({
            visible: true,
            serialAberto: entity,
        });
    }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    const params = queryString.parse(this.props.location.search);
    return {
      status: filtros.status || this.props.serial.data.statusList,
      statusOrdemFabricacao: filtros.statusOrdemFabricacao || this.props.serial.data.statusOrdemFabricacaoList,
      statusLote: filtros.statusLote || this.props.serial.data.statusLoteList,
      statusWip: filtros.statusWip || this.props.serial.data.statusWipList,
      statusImpressaoEtiqueta: filtros.statusImpressaoEtiqueta || this.props.serial.data.statusImpressaoEtiqueta,
    }
  };

    configTable = () => {
        const {entities, total} = this.props.serial.data || {};
        return {
            size: "small",
            i18n: "serial.tabela.",
            rowSelection: {
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                    if (selectedRows.length > 1) {
                        this.setState({reimpressaoState: true})
                        this.setState({selectedRowsImpressao: selectedRows})
                    } else if (selectedRows.length <= 1) {
                        this.setState({reimpressaoState: false})
                        this.setState({selectedRowsImpressao: selectedRows})
                    }
                },

        getCheckboxProps: record => ({
          name: record.codigo,
        })
      },
      columns: (this.state.filterComp.campos.filter(c => c.visible) || []),
      data: (entities || []).map((o) => ({...o, key: o.id, possuiHistorico: o.status !== "PENDENTE_APONTAMENTO"})),
      acoes: {
        historico: this.showModal,
        impressao: this.reimpressao,
        sucatear: this.sucatearSerial,
        folhaImpressao: this.openModalFolhaImpressao,
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      }
    }
  };


    getMessage = id => {
        return this.props.intl.formatMessage({id: id})
    };

  openModalFolhaImpressao = (object) => {
    this.props.folhaImpressaoDataRequest({id: object.idOrdemFabricacao})
    this.setState({folhaParaImprimir: {id: object.idOrdemFabricacao}, openModalFolhaImpressao: true});
  }
    getStatus(value) {
        return getMessage(`serial.status.${value}.label`)
    }

    getEtiquetaJaFoiImpressa(value) {
        return getMessage(`serial.filtro.statusImpressaoEtiqueta.${value}.label`)
    }

    getStatusOrdemFabricacao(value) {
        return getMessage(`ordemFabricacao.filtro.status.${value}.label`)
    }

  getStatusLote(value) {
    return value ? getMessage(`serial.filtro.status.lote.${value}.label`) : ""
  }

    getStatusRomaneio(value) {
        return value ? getMessage(`serial.filtro.status.${value}.label`) : ""
    }

    getStatusWip(value) {
        return value ? getMessage(`serial.filtro.statusWip.${value}.label`) : ""
    }

    getList = () => {
        const filtros = this.getFiltros();
        this.props.listSerialRequest(filtros);
    };

    getValoresIniciais = () => {
      return this.props.buscaValoresIniciaisRequest()
    }

    handlePesquisar = async values => {
        let state = this.state;
        state.filtros = {...this.state.filtros, ...values};
        state.filtros.paginacao.offset = 0;
        console.log(state.filtros)
        await this.setState(state);
        this.getList();
    };

    atualizaRegistrosPorPagina = quantidadeRegistros => {
        let state = this.state;
        state.filtros.paginacao.max = quantidadeRegistros;
        state.filtros.paginacao.offset = 0;
        this.setState(state)
    };

    reimpressao = (objeto) => {
        const seriais = objeto.length === undefined ? [objeto.serial] : objeto.map(obj => obj.serial)
        const ordemFabricacao = objeto.length === undefined ? objeto.ordemFabricacao : objeto[0].ordemFabricacao
        this.setState({
            impressaoModal: true,
            impressaoSeriais: seriais,
            impressaoSerialOF: ordemFabricacao
        })
    };

    sucatearSerial = (objeto) => {
        const filtros = this.getFiltros();
        this.props.serialSucatearRequest(objeto.id, filtros)
    }

    seriaisSaoMesmaOrdemFabricacao = () => {
        const ordemFabricacao = this.state.selectedRowsImpressao[0].ordemFabricacao
        return this.state.selectedRowsImpressao.every(serial => serial.ordemFabricacao === ordemFabricacao)
    };

    paginacao = (offs, sort, order) => {
        let state = this.state;
        state.filtros.paginacao.offset = offs;
        state.filtros.ordenacao.sort = sort;
        state.filtros.ordenacao.order =
            order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
        this.setState(state);
        this.getList()
    }

    redefinePaginacaoPadrao = () => {
        let state = this.state;
        state.filtros.offset = 1;
        this.setState(state);
    };

    getoffset = (offset, max) => {
        offset = (offset ? offset - 1 : offset) * max;
        return offset
    }

    getFiltros = () => {
        const {filtros} = this.state;
        let {offset, max} = filtros.paginacao;
        offset = this.getoffset(offset, max);
        const {sort, order} = filtros.ordenacao;
        return {
            ...filtros,
            offset,
            max,
            sort,
            order
        }
    }
}

List.propTypes = {
    intl: intlShape.isRequired
};

const mapStateToProps = store => ({
    serial: store.serial,
    etiqueta: store.serial.etiqueta,
    requestManager: store.requestManager,
});


const mapDispatchToProps = dispatch =>
    bindActionCreators({
        listSerialRequest,
        serialGerarEtiquetaRequest,
        serialEstornarApontamentoRequest,
        listSerialHistoricoRequest,
        serialExportarRequest,
        serialSucatearRequest,
        folhaImpressaoDataRequest,
        buscaValoresIniciaisRequest
    }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
