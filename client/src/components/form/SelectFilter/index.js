import * as React from 'react';
import { Form, Select } from "antd";
import PropTypes from "prop-types";

import { ordenaListaSelect, normalizeText } from "../../../utils/formatador";

const { Option } = Select;

export function SelectFilter({
  label,
  nomeAtributo,
  placeholder,
  list,
  message,
  isRequired,
  modo,
  onPressEnter,
  onBlur,
  size,
  onChange,
  isMultiple,
  allowClear,
  labelCol,
  onSearch,
  notFoundContent,
  isDisabled,
  loading,
  initialValue,
  hasFormItem,
  style,
  tokenSeparators,
  styleOptions,
  ordenar,
  suffixIcon,
  value,
  optionLabelProp,
  rules,
  dependencies,
  shouldUpdate,
  maxTagCount
}) {
  const options = {
    showSearch: true,
    autoFocus: isMultiple,
    onPressEnter: onPressEnter,
    onBlur: onBlur,
    placeholder: placeholder,
    size,
    mode: modo,
    allowClear: allowClear,
    onChange: onChange,
    disabled:isDisabled,
    onSearch:onSearch,
    notFoundContent:notFoundContent,
    loading: loading,
    defaultValue: initialValue,
    style: style,
    tokenSeparators:tokenSeparators,
    filterOption: (input, option) => {
      return (
        normalizeText(option.props.children).indexOf(normalizeText(input)) >= 0
      );
    },
    optionFilterProp: "children",
    styleOptions,
    suffixIcon,
    maxTagCount,
    optionLabelProp,
  };

  function getSelect(){
    return (
      <Select value={value} {...options} data-style-options={options.styleOptions}>
        {(ordenar ? ordenaListaSelect(list) : list).map(registro => (
          <Option
            key={registro.key}
            value={isMultiple ? registro.value : registro.key}
            disabled={registro.disabled}
            label={registro.label}
          >
            {registro.value}
          </Option>
        ))}
      </Select>
    )
  }
  if (!isMultiple && onChange) {
    options.onChange = onChange;
  }
  return (
    hasFormItem ?
      <Form.Item shouldUpdate={shouldUpdate} dependencies={dependencies} label={label} labelCol={labelCol} name={nomeAtributo} rules={[{ required: isRequired, message }, ...rules]}>
        {getSelect()}
      </Form.Item>
    :
      getSelect()
  );
}

SelectFilter.propTypes = {
  modo: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string
    })
  ),
  onPressEnter: PropTypes.func,
  onBlur: PropTypes.func,
  size: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  allowClear: PropTypes.bool,
  defaultValue: PropTypes.string,
  onSearch: PropTypes.func,
  loading: PropTypes.bool,
  hasFormItem: PropTypes.bool,
  styleOptions: PropTypes.string,
  ordenar: PropTypes.bool,
  suffixIcon: React.ReactNode,
  rules: PropTypes.array,
};

SelectFilter.defaultProps = {
  placeholder: null,
  isMultiple: false,
  modo: "",
  size: "large",
  onChange: null,
  isRequired: false,
  allowClear: false,
  onSearch: null,
  loading: false,
  isDisabled:false,
  notFoundContent:null,
  hasFormItem:true,
  tokenSeparators: [],
  styleOptions: null,
  ordenar:true,
  rules:[],
};
