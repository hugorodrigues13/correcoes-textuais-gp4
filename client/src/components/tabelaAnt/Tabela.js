import React, { PureComponent } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Table,
  Input,
  Button,
  Icon,
  Row,
  Col,
  Popconfirm,
  Tag,
  Tooltip,
  Empty,
  Switch
} from "antd";
import Highlighter from "react-highlight-words";
import history from "../../services/history";
import { formatadorTempo } from "../../utils/formatador";
import {
  AiOutlineAudit,
  FaEdit,
  FaEye,
  FaPrint,
  FaTrash,
  RiPagesLine,
  MdRestore,
  CgExport,
  AiFillPrinter,
  AiOutlineAppstore,
  FaBoxes,
  GrRevert,
  FaRegClone,
  MdHistory,
  IoMdCheckboxOutline,
  AiOutlineCheckCircle,
  MdUpdate
} from "react-icons/all";

class TabelaAnt extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      popConfirmVisible: false,
      indexCurrentRowTable: 0,
      tableColumns: [],
      searchText: "",
      data: []
    };
  }

  edit = objeto => {
    return this.props.configTable.acoes.editar(objeto);
  };

  delete = objeto => {
    this.props.configTable.acoes.excluir(objeto);
  };

  actionLote = objeto => {
    this.props.configTable.acoes.actionLote(objeto);
  };

  reimpressao = objeto => {
    this.props.configTable.acoes.reimpressao(objeto);
  };

  impressao = objeto => {
    this.props.configTable.acoes.impressao(objeto);
  };

  historico = objeto => {
    this.props.configTable.acoes.historico(objeto);
  };

  dividirParadas = objeto => {
    this.props.configTable.acoes.dividirParadas(objeto);
  };

  separacao = objeto => {
    this.props.configTable.acoes.separacao(objeto);
  };

  folhaImpressao = objeto => {
    this.props.configTable.acoes.folhaImpressao(objeto);
  };

  caixas = objeto => {
    this.props.configTable.acoes.caixas(objeto);
  };

  restaurar = objeto => {
    this.props.configTable.acoes.restaurar(objeto);
  };

  exportar = objeto => {
    this.props.configTable.acoes.exportar(objeto)
  };

  clonar = objeto => {
    history.push(this.props.configTable.acoes.clonar(objeto));
  }

  changeIsLiberado = objeto => {
    this.props.configTable.acoes.isLiberado(objeto);
  };

  abrirLote = objeto => {
    this.props.configTable.acoes.abrirLote(objeto);
  }

  concluirManualmente = objeto => {
    this.props.configTable.acoes.concluirManualmente(objeto);
  }

  onChange = (pagination, filters, sorter) => {
    this.props.configTable.paginacao.acao(
      pagination.current,
      sorter.field,
      sorter.order
    );
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.configTable.paginacao.atualizaRegistrosPorPagina(pageSize);
  };

  isSorteable = column => {
    if (column.isSorteable) {
      return {
        sorter: (a, b) => a[column.key] < b[column.key],
        sortDirections: ["descend", "ascend"]
      };
    }
  };

  isSearchable = column => {
    if (column.isSearchable) {
      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={"Pesquisar " + column.key}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Button
              type="link primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Procurar
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Resetar
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? "#1890ff" : undefined }}
          />
        ),
        onFilter: (value, record) =>
          record[column.key]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        )
      };
    }
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isVersionado = record => {
    return record.versao !== null && record.versao !== undefined && record.versao !== ""
  };

  isAtivo = record => {
    if (record.isAtivo !== undefined) {
      return !!record.isAtivo;
    }
    let status = typeof record === "object" ? record.status : record;
    return status && status.toUpperCase() === "ATIVO" || status && status.toUpperCase() === "DISPONIVEL";
  };

  isPendente = record => {
    let status = typeof record === "object" ? record.status : record;
    return status ? status.toUpperCase() === "PENDENTE" : "";
  };

  isEmUso = record => {
    let status = typeof record === "object" ? record.status : record;
    return status && status.toUpperCase() === "EM USO"
  };

  rowClicked = (record, index, event) => {
    return {onClick: event => {
        this.setState( { indexCurrentRowTable: index } );
      }}
  };

  chooseRowColor = index => {
    return ( ( index === this.state.indexCurrentRowTable ) && ( this.state.popConfirmVisible === true ) ) === true ? "row-selected-remove" : ""
  };

  render() {
    const { loading } = this.props;
    const props = this.props.configTable;

    if (
      props.columns[props.columns.length - 1]?.dataIndex !== "operation" &&
      props.acoes
    ) {
      const acoes = {
        title: "Ações",
        dataIndex: "operation",
        align: "center",
        width: props.acoes.width,
        render: (text, record) => {
          let titleTooltip = ""

          if(!this.isVersionado(record) || !this.isAtivo(record)) {
            titleTooltip += `${this.getMessage(
              "comum.usuarioCriacao.label"
            )}: ${record.usuarioCriacao || ""}`;

            titleTooltip += `\n${this.getMessage(
              "comum.dataCriacao.label"
            )}: ${formatadorTempo(record.dataCriacao || "")}\n`;
          }

          titleTooltip += `${this.getMessage(
            `${this.isVersionado(record) && this.isAtivo(record) ? "comum.usuarioAprovacao.label" : "comum.usuarioAtualizacao.label"}`
          )}: ${record.usuarioAlteracao || ""}`;

          titleTooltip += `\n${this.getMessage(
            `${this.isVersionado(record) && this.isAtivo(record) ? "comum.dataAprovacao.label" : "comum.dataAtualizacao.label"}`
          )}: ${formatadorTempo(record.dataAtualizacao || "")}`;

          if(record.usuarioAntesDaAprovacao) {
            titleTooltip += `\n${this.getMessage(
              "comum.usuarioAntesAprovacao.label"
            )}: ${record.usuarioAntesDaAprovacao || ""}`;

            titleTooltip += `\n${this.getMessage(
              "comum.dataAntesAprovacao.label"
            )}: ${formatadorTempo(record.dataAntesDaAprovacao || "")}`;
          }

          let propsEditar = null;
          if(props.acoes.editModal || props.acoes.editar){
            propsEditar = props.acoes.editModal ? {onClick: () => this.edit(record)} : {href: this.edit(record)};
          }

          return (
            <div>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24 }}
                style={{ justifyContent: "center", display: "flex" }}
              >
                {(props.acoes.editar && (props.acoes.romaneio ? record.status === "ABERTO" : true)) && (
                  <Col>
                    <Tooltip
                      title={record.isEditavel !== undefined && !record.isEditavel ? this.getMessage("comum.naoPodeEditar.label") : this.getMessage("comum.editar.label")}
                      placement="bottom"
                    >
                      <Button
                        type="link primary"
                        disabled={
                          record.isEditavel !== undefined && !record.isEditavel
                        }
                        {...(props.acoes.editarProps ? props.acoes.editarProps(record) : {})}
                        {...propsEditar}
                        // onClick={() => history.push(this.edit(record))}
                      ><FaEdit /></Button>
                    </Tooltip>
                  </Col>
                )}
                {(props.acoes.visualizar && (props.acoes.romaneio ? record.status !== "ABERTO" : true)) && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.visualizar.label")}
                    >
                      <Button
                        type="link default"
                        onClick={() =>
                          history.push(props.acoes.visualizar(record.id))
                        }
                      ><FaEye /></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.seriais && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("faturamento.seriais.label")}
                    >
                      <Button
                        type="link default"
                        onClick={() =>
                          window.open(props.acoes.seriais(record), '_blank')
                        }
                      >
                        <AiOutlineAppstore size={18} color={"#333333"} />
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.actionLote && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage(props.acoes.desativarRomaneio ? "comum.lote.concluirOP.label" : record.statusLote === "FECHADO" ? "comum.romaneio.label" : "comum.lote.fechar.label")}
                    >
                      <Button
                        type="link default"
                        onClick={() =>
                          this.actionLote(record)
                        }
                      >{
                        props.acoes.desativarRomaneio ? <AiOutlineCheckCircle  color={"#333333"} size={18} /> :
                        record.statusLote === "FECHADO" ? <img
                          className=""
                          alt="logo"
                          src={require("../../images/icon-romaneio01.png")}
                          width="20px"
                        /> : <img
                          className=""
                          alt="logo"
                          src={require("../../images/icon-romaneio02.png")}
                          width="20px"
                        />
                        }
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.reimpressao && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.reimpressao.label")}
                    >
                      <Button
                        disabled={!record.podeReimprimirEtiqueta}
                        type="link default"
                        onClick={() => this.reimpressao(record)}
                      ><FaPrint /></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.impressao && (
                  <Col>
                    <Tooltip
                      placement={"bottom"}
                      title={this.getMessage("comum.impressao.label")}
                    >
                      <Button
                        type={"link primary"}
                        disabled={record.status === "FINALIZADA" || record.status === "CANCELADA"}
                        {...(props.acoes.impressaoProps ? props.acoes.impressaoProps(record) : {})}
                        onClick={() => this.impressao(record)}
                      ><AiFillPrinter size={18} /></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.historico && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.historico.label")}
                    >
                      <Button
                        disabled={!record.possuiHistorico}
                        type={"link default"}
                        {...(props.acoes.historicoProps ? props.acoes.historicoProps(record) : {})}
                        onClick={() => this.historico(record)}
                      >
                        {(props.acoes.historicoProps ? props.acoes.historicoProps(record)?.icone : null) || <MdHistory size={18}/>}
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.dividirParadas && (
                  <Col>
                    <Tooltip
                      placement="top"
                      title={this.getMessage("comum.dividirParada.label")}
                    >
                      <Button
                        type={"link default"}
                        onClick={() => this.dividirParadas(record)}
                      >
                        {<MdUpdate size={18}/>}
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.separacao && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.separacao.label")}
                    >
                      <Button
                        type={"link default"}
                        {...(props.acoes.separacaoProps ? props.acoes.separacaoProps(record) : {})}
                        onClick={() => this.separacao(record)}
                      >
                        <img
                          alt={"separacao"}
                          src={require("../../images/almoxarifado.png")}
                          width="18px"
                          height="18px"/>
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.folhaImpressao && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.folhaImpressao.label")}
                    >
                      <Button
                        type={"link default"}
                        onClick={() => this.folhaImpressao(record)}
                      ><RiPagesLine size={18}/></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.caixas && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("faturamento.caixas.modal.caixas.label")}
                    >
                      <Button
                        type={"link default"}
                        {...(props.acoes.caixasProps ? props.acoes.caixasProps(record) : {})}
                        onClick={() => this.caixas(record)}
                      >
                        <FaBoxes color={"#333333"} size={18}/>
                      </Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.restaurar && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.restaurar.label")}
                    >
                      <Button
                        type={"link default"}
                        onClick={() => this.restaurar(record)}
                      ><MdRestore size={18}/></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.exportar && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.reexportar.label")}
                    >
                      <Button
                        type={"link default"}
                        disabled={record.status !== "ERRO_EXPORTACAO"}
                        onClick={() => this.exportar(record)}
                      ><CgExport size={18}/></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.clonar && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.clonar.label")}
                    >
                      <Button
                        type={"link default"}
                        onClick={() => this.clonar(record)}
                      ><FaRegClone size={12}/></Button>
                    </Tooltip>
                  </Col>
                )}
                {props.acoes.excluir && (
                  <Col>
                    <Popconfirm icon={""}
                      onVisibleChange={ v => this.setState( { popConfirmVisible: v } ) }
                      cancelText={ <FormattedMessage id="comum.nao.label" /> }
                      okText={ <FormattedMessage id="comum.sim.label" /> }
                      disabled={
                        record.isRemovivel !== undefined && !record.isRemovivel
                      }
                      title={
                        <FormattedMessage id="comum.remocao.confirmar.mensagem" />
                      }
                      onConfirm={() => {
                        if (
                          record.isRemovivel === undefined ||
                          (record.isRemovivel)
                        ) {
                          this.delete(record);
                        }
                      }}
                    >
                      <Tooltip
                        placement="bottom"
                        title={record.isRemovivel !== undefined && !record.isRemovivel ? this.getMessage("comum.naoPodeRemover.label") : this.getMessage("comum.excluir.label")}
                      >
                        <Button
                          disabled={
                            record.isRemovivel !== undefined &&
                            !record.isRemovivel
                          }
                          type="link danger"
                        ><FaTrash /></Button>
                      </Tooltip>
                    </Popconfirm>
                  </Col>
                )}
                {props.acoes.sucatear && (
                  <Col>
                    <Popconfirm icon={""}
                      onVisibleChange={ v => this.setState( { popConfirmVisible: v } ) }
                      cancelText={ <FormattedMessage id="comum.nao.label" /> }
                      okText={ <FormattedMessage id="comum.sim.label" /> }
                      disabled={
                        record.isRemovivel !== undefined && !record.isRemovivel
                      }
                      title={
                        <FormattedMessage id="comum.sucatear.confirmar.mensagem" />
                      }
                      onConfirm={() => {
                        if (
                          record.isRemovivel === undefined ||
                          (record.isRemovivel)
                        ) {
                          props.acoes.sucatear(record);
                        }
                      }}
                    >
                      <Tooltip
                        placement="bottom"
                        title={record.isRemovivel !== undefined && !record.isRemovivel ? this.getMessage("comum.naoPodeSucatear.label") : this.getMessage("comum.sucatear.label")}
                      >
                        <Button
                          disabled={
                            record.isRemovivel !== undefined &&
                            !record.isRemovivel
                          }
                          type="link danger"
                        ><FaTrash /></Button>
                      </Tooltip>
                    </Popconfirm>
                  </Col>
                )}
                {props.acoes.infoAudit && (
                  <Tooltip
                    placement="bottom"
                    type="light"
                    html={true}
                    overlayStyle={{
                      whiteSpace: "pre-wrap",
                      textAlign: "right"
                    }}
                    title={titleTooltip}
                  >
                    <Col>
                      <Button type={"link"} style={{cursor: "help" }}>
                        <AiOutlineAudit />
                      </Button>
                    </Col>

                  </Tooltip>
                )}
                {props.acoes.abrirLote && (
                  <Col>
                    <Popconfirm icon={""}
                                onVisibleChange={ v => this.setState( { popConfirmVisible: v } ) }
                                cancelText={ <FormattedMessage id="comum.nao.label" /> }
                                okText={ <FormattedMessage id="comum.sim.label" /> }
                                disabled={
                                  record.statusLote !== undefined && record.statusLote !== "FECHADO" ||
                                  record.foiAgrupado !== undefined && record.foiAgrupado
                                }
                                title={
                                  <FormattedMessage id="comum.abrirLote.confirmar.mensagem" />
                                } onConfirm={() => this.abrirLote(record)}>
                      <Tooltip
                        placement="bottom"
                        title={this.getMessage("comum.abrirLote.label")}
                      >
                        <Button
                          disabled={record.statusLote !== undefined && record.statusLote !== "FECHADO" ||
                          record.foiAgrupado !== undefined && record.foiAgrupado}
                          type={"link danger"}
                        ><GrRevert size={18}/></Button>
                      </Tooltip>
                    </Popconfirm>
                  </Col>
                )}
                {props.acoes.concluirManualmente && (
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={this.getMessage("comum.concluirManualmente.label")}
                    >
                      <Button
                        disabled={record.isConcluirManualmente || record.versao < 10 || record.status === 'CONCLUIDA'}
                        type={"link default"}
                        onClick={() => this.concluirManualmente(record)}
                      ><IoMdCheckboxOutline size={18}/></Button>
                    </Tooltip>
                  </Col>
                )}
              </Row>
            </div>
          );
        }
      };
      props.columns.push(acoes);
    }
    const columns = props.columns.map(c => {
      if (c.dataIndex === "operation") {
        return c;
      } else {
        return {
          title: this.getMessage(props.i18n + c.key + ".label"),
          dataIndex: c.key,
          width: c.width,
          defaultSortOrder: c.defaultSort ? c.defaultSortOrder ? c.defaultSortOrder : "ascend" : null,
          sorter: c.isSorteable,
          render: c.render || ((text, record) => {
            if (c.key === "status" && c.ativarOuDesativar) {
              return (
                <div>
                  <Col>
                    {this.isPendente(text)
                      ? <Tag style={{borderRadius: 12, paddingLeft: 12, paddingRight: 12}}
                        color={"#FAAD14"}>
                        {text.toUpperCase()}
                      </Tag>
                      : <Tooltip
                        placement="bottom"
                        title={record.isEditavel !== undefined && !record.isEditavel ? this.getMessage("comum.naoPodeEditarERemover.label"):
                          this.isAtivo(record)
                            ? this.getMessage("comum.inativar.label")
                            : this.getMessage("comum.ativar.label")
                        }
                      >
                        <Switch
                          style={{width: 71, backgroundColor: this.isAtivo(record) ? "rgba(49,195,44,0.71)" : "rgba(190,190,185,0.75)" }}
                          checked={this.isAtivo(record)}
                          checkedChildren={"Ativo"}
                          unCheckedChildren={"Inativo"}
                          loading={c.statusLoading.includes(record.id)}
                          onClick={() => c.ativarOuDesativar(record)}
                          disabled={record.isEditavel !== undefined && !record.isEditavel}
                        />
                      </Tooltip>}
                  </Col>
                </div>
              );
            }else if(c.key === "status" && !c.ativarOuDesativar && c.selectStatus){
              return(
              <Tag
                style={{borderRadius: 12, paddingLeft: 12, paddingRight: 12}}
                color={
                  this.isPendente(text)
                    ? "#FAAD14"
                    : this.isAtivo(record)
                    ? "#1D9D0F"
                    : this.isEmUso(record)
                    ? "#00158A"
                    : "#E64949"
                }
              >
                {text.toUpperCase()}
              </Tag>
              )
            } else if (c.key === "isAtivo" || c.key === "enabled") {
              return (
                <div>
                  <Tag style={{borderRadius: 12, paddingLeft: 12, paddingRight: 12}} color={text ? "#1D9D0F" : "#E64949"}>
                    {this.getMessage(text.toString()).toUpperCase()}
                  </Tag>
                </div>
              );
            } else if (c.isDate) {
              return formatadorTempo(text);
            }
            return text;
          })
        };
      }
    });
    return (
      <Row>
        <Col span={24}>
          <Table
            tableLayout="auto"
            rowSelection={props.rowSelection}
            className={"removeOverflowX"}
            expandable={props.expandable}
            summary={props.summary}
            columns={columns}
            dataSource={props.data}
            loading={loading}
            scroll={props.scroll}
            size={props.size}
            rowClassName={ props.rowClassName || ((record, index) => this.chooseRowColor( index )) }
            onChange={this.onChange}
            onRow={this.rowClicked} /*onRowClick*/
            rowKey={record => record.key || record.id}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={this.getMessage("table.empty.label")}
                />
              )
            }}
            pagination={
              props.paginacao
                ? {
                    defaultPageSize: 10,
                    current: props.paginacao.offset||1,
                    showSizeChanger: true,
                    total: props.paginacao.total,
                    pageSizeOptions:
                      props.paginacao.qtdRegistrosPorPagina !== undefined
                        ? props.paginacao.qtdRegistrosPorPagina
                        : ["10", "20", "30"],
                    pageSize: props.paginacao.max,
                    onShowSizeChange: this.onShowSizeChange
                  }
                : false
            }
          />
        </Col>
      </Row>
    );
  }
}

export default injectIntl(TabelaAnt);
