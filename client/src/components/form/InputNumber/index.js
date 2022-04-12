import React from "react";
import { Form, InputNumber } from "antd";
import PropTypes from "prop-types";

export function InputNumberAnt({
  label,
  nomeAtributo,
  message,
  placeholder,
  isRequired,
  min,
  max,
  validateStatus,
  disabled,
  labelCol,
  size,
  onChange,
  formatter,
  parser,
  precision,
  value,
  style,
  dependencies,
  rules,
  shouldUpdate,
}) {
  return (
    <Form.Item
      name={nomeAtributo}
      label={label}
      validateStatus={validateStatus}
      labelCol={labelCol}
      dependencies={dependencies}
      shouldUpdate={shouldUpdate}
      rules={[
        {
          required: isRequired,
          message
        },
        ...rules
      ]}
    >
        <InputNumber
          size={size}
          min={min}
          max={max}
          formatter={formatter}
          parser={parser}
          precision={precision}
          placeholder={placeholder}
          onChange = {onChange}
          disabled={disabled}
          value={value}
          style={style}
        />
    </Form.Item>
  );
}

InputNumberAnt.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  precision: PropTypes.number,
  validateStatus: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  value: PropTypes.number
};

InputNumberAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  size: "large",
  rules: [],
};
