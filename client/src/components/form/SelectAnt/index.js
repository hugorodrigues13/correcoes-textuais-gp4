import React from "react";
import { Form, Select } from "antd";
import PropTypes from "prop-types";

import { ordenaListaSelect } from "../../../utils/formatador";

const { Option } = Select;

export function SelectAnt({
  label,
  nomeAtributo,
  placeholder,
  list,
  message,
  isRequired,
  modo,
  onBlur,
  size,
  onChange,
  isMultiple,
  allowClear,
  labelCol,
  ordenar,
  isDisabled,
  initialValue,
  showArrow,
  props,
  style,
  showSearch,
  filterOption,
  semFormItem,
  dropdownMatchSelectWidth,
  value,
  rules,
  optionLabelProp,
  maxTagCount,
  className,
  bordered,
}) {
  const options = {
    autoFocus: isMultiple,
    onBlur: onBlur,
    placeholder: placeholder,
    size:size,
    mode: modo,
    allowClear: allowClear,
    disabled: isDisabled,
    defaultValue: initialValue,
    value: value,
    dropdownMatchSelectWidth,
    showArrow,
    showSearch,
    filterOption,
    optionLabelProp,
    maxTagCount,
    className,
    bordered,
    ...props
  };
  if (!isMultiple && onChange) {
    options.onChange = onChange;
  }

  if(ordenar === undefined || ordenar ){
    list = ordenaListaSelect(list);
  }

  function renderSelect(){
    return (
      <Select {...options} style={style}>
        {list.map(registro => (
          <Option
            key={registro.key}
            value={isMultiple ? registro.value : registro.key}
            label={registro.label}
            disabled={registro.disabled}
          >
            {registro.value}
          </Option>
        ))}
      </Select>
    )
  }

  return semFormItem
    ? renderSelect()
    : (
    <Form.Item label={label} name={nomeAtributo} rules={[{ required: isRequired, message }, ...rules]} initialValue={initialValue} labelCol={labelCol}>
      {renderSelect()}
    </Form.Item>
  );
}

SelectAnt.propTypes = {
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
  onBlur: PropTypes.func,
  size: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  allowClear: PropTypes.bool,
  rules: PropTypes.array,
  value: PropTypes.object,
  dropdownMatchSelectWidth: PropTypes.bool
};

SelectAnt.defaultProps = {
  placeholder: null,
  isMultiple: false,
  modo: "",
  size: "large",
  onChange: null,
  isRequired: false,
  allowClear: false,
  isDisabled:false,
  showArrow: true,
  rules: [],
  dropdownMatchSelectWidth: true
};
