import React, {Component, useEffect} from "react";
import PropTypes from "prop-types";
import { injectIntl, FormattedMessage } from "react-intl";
import { Col, Row, Form, Collapse, Button, Icon } from "antd";

import { InputAnt } from "../form/Input";
import { InputNumberAnt } from "../form/InputNumber";
import { RangeDatePickerAnt } from "../form/RangeDatePicker";
import { SelectFilter } from "../form/SelectFilter";
import {SelectAnt} from "../form/SelectAnt";
import {SwitchAnt} from "../form/Switch";
import {RangeTimePickerAnt} from "../form/RangeTimePicker";
import {BiSkipNext, BiSkipPrevious, GrFormPrevious, GrPrevious} from "react-icons/all";
import {DatePickerAnt} from "../form/DatePicker";

class Filter extends Component {
  formRef = React.createRef();

  static propTypes = {
    handlePesquisar: PropTypes.func.isRequired,
    filtros: PropTypes.object.isRequired,
    onChange: PropTypes.string,
    mapPropsToFields: PropTypes.object
  };

  componentDidMount() {
    this.formRef.current.setFieldsValue(this.props.mapPropsToFields)
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    this.formRef.current.setFieldsValue(this.props.mapPropsToFields)
  }

  tratarStrings = (data) => {
    return (data || []).map(d => ({
      key: d,
      value: d,
    }))
  }

  handleSetDataSelect = (data, tratamento, opcaoTodos, renderLabel, useMessage=true) => {
    let opcoes;

    if (tratamento) {
      opcoes = (data || []).map(item => ({
        key: item.id ? item.id + "" :item.key,
        value: item.descricao ? item.descricao : item.nome
      }));
    } else {
      opcoes = (data || []).map(registro => ({
        key: registro,
        value: useMessage ? this.getMessage(registro) : renderLabel ? renderLabel(registro) : registro
      }));
    }

    if(opcaoTodos != undefined){
      opcoes.unshift({
        key: opcaoTodos,
        value: this.getMessage(opcaoTodos)
      });
    }

    return opcoes;
  };

  onChange = (e, tipo) =>{
    if(tipo !== undefined && tipo !== ""){
      let campoValor = {};
      if(tipo === "toUpper"){
        campoValor[e.target.name] = e.target.value.toUpperCase();
      }
       this.formRef.current.setFieldsValue( campoValor );
    }
  };

  getCampoFilter = (c, data, index) => {
    let prefix = this.props.filterComp.prefix;
    let tela = this.props.tela
    let colProps = c.colProps ? c.colProps : {span: 7};
    if (c.tipo === "text") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <InputAnt
            label={this.getMessage(prefix + "." + (c.label || c.nome) + ".label")}
            nomeAtributo={c.nome}
            labelCol={this.props.filterComp.labelCol}
            maxLength={c.maxLength}
            getValueFromEvent={c.nome === "et"}
            onChange={e => this.onChange(e,c.onChange)}
            trigger={!!c.onChange}
            disabled={c.disabled || false}
          />
        </Col>
      );
    } else if (c.tipo === "number") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <InputNumberAnt
            label={this.getMessage(prefix + "." + c.nome + ".label")}
            nomeAtributo={c.nome}
            labelCol={this.props.filterComp.labelCol}
            disabled={c.disabled || false}
            min={c.min}
            max={c.max}
          />
        </Col>
      );
    } else if (c.tipo === "select") {
      let seletor = c.seletor || c.nome;
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <SelectAnt
            initialValue={c.defaultValue || c.opcaoTodos}
            allowClear={c.allowClear !== undefined ? c.allowClear : true}
            label={c.customLabel || this.getMessage(prefix + "." + c.nome + ".label")}
            list={data && this.handleSetDataSelect(data[seletor], c.tratamento, c.opcaoTodos, c.renderLabel, c.useMessage)}
            nomeAtributo={c.nome}
            labelCol={this.props.filterComp.labelCol}
            ordenar={c.ordenar}
            isDisabled={c.disabled || false}
            onChange={c.onChange}
            props={c.props || {}}
          />
        </Col>
      );
    } else if (c.tipo === "selectFilter") {
      let seletor = c.seletor || c.nome;
      const botoes = c.prevNextBotoes
      const selectData = data[seletor]
      const mudar = (offset) => {
        console.log(selectData)
        if (!selectData?.length) return
        const atual = this.formRef.current.getFieldValue(c.nome)
        const index = selectData.indexOf(atual)
        const next = selectData[index + offset] || selectData[(offset === 1 ? 0 : selectData.length - 1)]
        this.formRef.current.setFieldsValue({
          [c.nome]: next
        })

        if(c.filterOnPrevNext) {
          this.formRef.current.submit()
        }
      }
      return (
        <>
          {botoes && <Button
            icon={<BiSkipPrevious size={30}/>}
            type={"ghost"}
            size={"large"}
            style={{marginTop: 32, border: 0}}
            onClick={() => mudar(-1)}
          />}
          <Col {...colProps} key={index} style={this.props.filterComp.margin}>
            <SelectFilter
              initialValue={c.defaultValue}
              allowClear={true}
              label={this.getMessage(prefix + "." + c.nome + ".label")}
              list={c.tratarStrings ? this.tratarStrings(data[seletor]) : c.tratarFilter ? (data && this.handleSetDataSelect(data[seletor], c.tratamento, c.opcaoTodos, c.renderLabel, c.useMessage)) : (data[seletor] || [])}
              size={"large"}
              nomeAtributo={c.nome}
              onChange={c.onChange}
              labelCol={this.props.filterComp.labelCol}
              isDisabled={c.disabled || false}
            />
          </Col>
          {botoes && <Button
            icon={<BiSkipNext size={30}/>}
            type={"ghost"}
            size={"large"}
            style={{marginTop: 32, border: 0}}
            onClick={() => mudar(1)}
          />}
        </>

      );
    } else if (c.tipo === "date") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <DatePickerAnt
            label={this.getMessage(prefix + "." + c.nome + ".label")}
            nomeAtributo={c.nome}
            placeholder={"Data"}
            onChange={c.onChange}
            labelCol={this.props.filterComp.labelCol}
            disabled={c.disabled || false}
            dateFormat={ c.dateFormat ? c.dateFormat : "DD/MM/YYYY"}
          />
        </Col>
      );
    } else if (c.tipo === "rangeDate") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <RangeDatePickerAnt
            showTime={ c.showTime ?  c.format ? { format: c.format } : { format: 'HH:mm' } : false}
            label={this.getMessage(prefix + "." + c.nome + ".label")}
            nomeAtributo={c.nome}
            placeholder={["Data Inicial", "Data Final"]}
            labelCol={this.props.filterComp.labelCol}
            disabled={c.disabled || false}
            dateFormat={ c.dateFormat ? c.dateFormat : "DD/MM/YYYY"}
          />
        </Col>
      );
    } else if (c.tipo === "rangeTime") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <RangeTimePickerAnt
            label={this.getMessage(prefix + "." + c.nome + ".label")}
            nomeAtributo={c.nome}
            placeholder={["Horário Inicial", "Horário Final"]}
            labelCol={this.props.filterComp.labelCol}
            disabled={c.disabled || false}
            dateFormat={ c.dateFormat ? c.dateFormat : "HH:mm"}
          />
        </Col>
      );
    } else if (c.tipo === "switch") {
      return (
        <Col {...colProps} key={index} style={this.props.filterComp.margin}>
          <SwitchAnt
            label={this.getMessage(prefix + "." + c.nome + ".label")}
            nomeAtributo={c.nome}
            initialValue={c.initialValue}
            onChange={c.onChange}
            checkedChildren={c.checkedChildren}
            unCheckedChildren={c.unCheckedChildren}
          />
        </Col>
      )
    }
  };

  render() {
    const { Panel } = Collapse;
    const { filterComp } = this.props;
    const data = this.props.data !== null ? this.props.data : [];
    const { extra, collapseProps } = this.props
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition={"right"} {...collapseProps}>
        <Panel header="Filtro" key="1" forceRender>
          <Form  ref={this.formRef} layout={filterComp.layout || null} onFinish={this.onSubmit}>
            <Row gutter={21}>
              {filterComp.campos.filter(c => !c.tabela).map((c, index) => {
                return this.getCampoFilter(c, data, index);
              })}
              <Col span={3} style={{ marginTop: "29px" }}>
                <Form.Item>
                  <Button size="large" htmlType="submit" type="primary" disabled={this.props.button != null ? this.props.button.disabled : false}>
                    {(this.props.button == null || !this.props.button.hasIcon) ? null : <Icon type="search" />}
                    <FormattedMessage id={this.props.button != null ? this.props.button.nome :  "comum.pesquisar.label"} />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            {extra}
          </Form>
        </Panel>
      </Collapse>
    );
  }
  onSubmit = fieldsValue => {
      const dateFormat = "YYYY-MM-DD";
      const rangeValue = fieldsValue["rangeDate"];
      const {rangeDate, ...values} = {
        ...fieldsValue,
        date: fieldsValue["date"]
          ? fieldsValue["date"].format(dateFormat)
          : null,
        dataInicial: rangeValue ? rangeValue[0].format(dateFormat) : null,
        dataFinal: rangeValue ? rangeValue[1].format(dateFormat) : null
      };
      this.props.handlePesquisar(values);
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };
}

export default injectIntl(Filter);
