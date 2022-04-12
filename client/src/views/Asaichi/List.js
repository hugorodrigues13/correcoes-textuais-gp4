import * as React from 'react';
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
  asaichiGraficoDefeitosRequest,
  asaichiListRequest,
  asaichiProducaoDiariaRequest,
  asaichiProducaoMensalRequest,
  asaichiProducaoSemanalRequest,
  asaichiTabelaDefeitosRequest,
  asaichiTabelaProducaoRequest,
  asaichiTabelaProdutividadeRequest
} from "../../store/modules/Asaichi/action";
import {BackTop, Button, Col, PageHeader, Row, Spin, Space, Popover} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAsaichi from "./TabelaAsaichi";
import * as moment from "moment";
import GraficoProducaoSemanal from "./GraficoProducaoSemanal";
import GraficoProducaoDiaria from "./GraficoProducaoDiaria";
import "./style.css";
import GraficoProducaoMensal from "./GraficoProducaoMensal";
import GraficoDefeitosTri from "./GraficoDefeitosTri";
import {AiOutlineToTop} from "react-icons/all";
import {getMessage} from "../../components/messages";

const tipos = ["PECA", "CONECTOR"]

class AsaichiList extends React.Component {
  getValoresFiltros = async (valor) => {
    let state = this.state
    state.filtros.data = valor
    await this.setState(state)
    const filtros = this.getFiltros();
    this.props.asaichiListRequest(filtros)
  }

  renderTipos = (tipo) => {
    return getMessage(tipo)
  }

  changeTipo = async (tipo) => {
    let state = this.state
    state.filtros.tipo = tipo
    state.filterComp = {
      ...state.filterComp, campos: state.filterComp.campos.map(c => {
        return {...c, hidden: c.nome === 'conector' && tipo === 'PECA'}
      })
    }
    await this.setState(state)
  }

  state = {
    entity: [],
    totalCount: 0,
    popoverAberto: false,
    popoverTempo: 1,
    selectedRows: [],
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "asaichi",
      campos: [
        {nome: "linhaProducao", tipo: "selectFilter", colProps: {span: 5}, seletor: "linhasProducao", tratarStrings: true, prevNextBotoes: true, filterOnPrevNext: true},
        {nome: "data", colProps: {span: 5}, tipo: "date", onChange: this.getValoresFiltros},
        {nome: "tipo", colProps: {span: 3}, tipo: "select", seletor: 'tipos', defaultValue: "CONECTOR", renderLabel: this.renderTipos, onChange: this.changeTipo},
        {nome: "conector", colProps: {span: 5}, hidden: true, tipo: "selectFilter", seletor: "conectores", tratarStrings: true},
      ],
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        order: "asc"
      }
    }
  };

  componentDidMount() {
    this.getList()
  }


  render(){
    const {data, loadingFiltros} = this.props.asaichi
    const {campos} = this.state.filterComp
    const filterComp = {...this.state.filterComp, campos: campos.filter(c => !c.hidden)}

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"asaichi.title.label"}/>}
        />
        <Spin spinning={loadingFiltros}>
          <Filter
            filterComp={filterComp}
            filtros={this.state.filtros}
            handlePesquisar={this.handlePesquisar}
            data={{...data, tipos: tipos}}
            mapPropsToFields={this.mapPropsToFields()}
          />
        </Spin>
         <br/>
          {this.renderObservacoes()}
          <br/>
          {this.renderTabelas()}
          <br/>
          {this.renderGraficosSuperiores()}
          <br/>
          {this.renderGraficosInferiores()}
        <BackTop duration={100} className="btt-asaichi">
          <Button style={{
            height: 40,
            lineHeight: '40px',
            borderRadius: 10,
            padding: 5
          }} type="primary">
            <AiOutlineToTop size={"2em"} />
          </Button>
        </BackTop>
      </>
    )
  }

  renderObservacoes = () => {
    const { data } = this.props.asaichi
    const { observacoes } = data

    observacoes && observacoes.length > 0 &&  observacoes.sort((a, b) => (a.turno > b.turno) ? 1 : ((a.turno < b.turno) ? -1 : 0))

    const content = (string) => <div dangerouslySetInnerHTML={{ __html: string }}></div>

    if(observacoes && observacoes.length > 0 && observacoes.some(el => el.observacao && el.observacao !== '<p></p>') ){
      return (
        <Space className='box-observacoes'>
          <span className='title'>{getMessage("comum.observacao.label")}:</span>
          {observacoes.map( el => {
            if(el.observacao){
              return (
                <Space className='itens-observacoes'>
                  <Popover content={content(el.observacao)} title={getMessage("comum.observacao.label")} trigger="click" >
                    <Button type="primary">{el.turno}</Button>
                  </Popover>
                </Space>
              )
            }
          })}
        </Space>
      )
    }
  }

  renderTabelas = () => {
    const {data, ...asaichi} = this.props.asaichi
    const turnos = (data.turnos || []).sort()

    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <TabelaAsaichi
              loading={asaichi.loadingTabelaProducao}
              titulo={"asaichi.tabelas.producao.label"}
              prefixo={"asaichi.tabelas.producao."}
              rows={['plano', 'real', 'porcentagem']}
              cols={[...turnos.map(t => `#${t}`), 'total']}
              colRender={(col, value) => {
                if (col === 'porcentagem') return value + '%'
                return value
              }}
              data={asaichi.tabelaProducao || []}
            />
          </Col>
          <Col span={12}>
            <TabelaAsaichi
              loading={asaichi.loadingTabelaDefeitos}
              titulo={"asaichi.tabelas.defeitos.label"}
              prefixo={"asaichi.tabelas.defeitos."}
              rows={['qtde', 'porcentagem', 'meta']}
              cols={[...turnos.map(t => `#${t}`), 'total']}
              colRender={(col, value) => {
                if (col === 'porcentagem') return value + '%'
                return value
              }}
              data={asaichi.tabelaDefeitos || []}
            />
          </Col>
        </Row>
        <br/>
        <Row gutter={24}>
          <Col span={24}>
            <TabelaAsaichi
              small
              loading={asaichi.loadingTabelaProdutividade}
              titulo={"asaichi.tabelas.produtividade.label"}
              prefixo={"asaichi.tabelas.produtividade."}
              rows={['planoPessoas', 'produtividadePlanejado', 'pessoasTreinamento', 'pessoasHabilitadas', 'produtividadeReal', 'metaHK']}
              colRender={(col, value) => {
                if (col === 'produtividadePlanejado' || col === 'produtividadeReal') {
                  return (value ? value.toFixed(2) : '')
                }
                return value
              }}
              cols={[...turnos.map(t => `#${t}`), 'total']}
              data={asaichi.tabelaProdutividade}
            />
          </Col>
        </Row>
      </>
    )
  }

  renderGraficosSuperiores = () => {
    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <GraficoProducaoSemanal/>
          </Col>
          <Col span={12}>
            <GraficoProducaoDiaria/>
          </Col>
        </Row>

      </>
    )
  }

  renderGraficosInferiores = () => {
     const dataFiltro = (this.getFiltros().data || moment()).format("DD/MM/YYYY")

    return (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <GraficoProducaoMensal data={dataFiltro} />
          </Col>
        </Row>
        <br/>
        <Row gutter={24}>
          <Col span={24}>
            <GraficoDefeitosTri
              dia={this.state.filtros.data || moment()}
            />
          </Col>
        </Row>
      </>
    )
  }

  // boilerplate abaixo

  getList = () => {
    const filtros = this.getFiltros();
    this.props.asaichiListRequest(filtros)
    this.props.asaichiTabelaProducaoRequest(filtros)
    this.props.asaichiTabelaDefeitosRequest(filtros)
    this.props.asaichiTabelaProdutividadeRequest(filtros)
    this.props.asaichiProducaoDiariaRequest(filtros)
    this.props.asaichiProducaoSemanalRequest(filtros)
    this.props.asaichiProducaoMensalRequest(filtros)
    this.props.asaichiGraficoDefeitosRequest(filtros)
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      linhaProducao: filtros.linhaProducao || (this.props.asaichi.data.linhasProducao || [])[0],
      conector: filtros.conector || "",
      tipo: filtros.tipo || "CONECTOR",
      data: filtros.data || moment()
    };
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState( state );
    this.getValoresFiltros(state.filtros.data)
    this.getList()
  };

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

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

}
AsaichiList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  asaichi: store.asaichi,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    asaichiListRequest,
    asaichiTabelaProducaoRequest,
    asaichiTabelaDefeitosRequest,
    asaichiTabelaProdutividadeRequest,
    asaichiProducaoDiariaRequest,
    asaichiProducaoSemanalRequest,
    asaichiProducaoMensalRequest,
    asaichiGraficoDefeitosRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AsaichiList))
