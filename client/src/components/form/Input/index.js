import React from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

export function InputAnt({
  label,
  nomeAtributo,
  message,
  placeholder,
  isRequired,
  validator,
  disabled,
  type,
  validateStatus,
  help,
  somenteLeitura,
  handleConfirmBlur,
  labelCol,
  size,
  onChange,
  onFocus,
  maxLength,
  autoFocus,
  trigger,
  getValueFromEvent,
  onPressEnter,
  onKeyDown,
  value,
  suffixIcon,
  ghost,
  tabIndex
}) {
  return (
    <Form.Item
      label={label}
      validateStatus={validateStatus}
      help={help}
      labelCol={labelCol}
      name={nomeAtributo}
      trigger={trigger ? nomeAtributo : "onChange"}
      getValueFromEvent={getValueFromEvent ? onChange : null}
      rules={[
        {
          required: isRequired,
          message
        },
        {
          validator: validator
        }
      ]}
    >

        <Input
          size={size}
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={somenteLeitura}
          onFocus={onFocus}
          onBlur={handleConfirmBlur}
          onChange = {onChange}
          maxLength={maxLength}
          name={nomeAtributo}
          onPressEnter={onPressEnter}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          suffix={suffixIcon}
          tabIndex={tabIndex}
          style={ghost ? {height: 22, padding: 0, border: 0, fontSize: 15, ...(disabled ? {background: 'unset', color: 'unset'} : {})} : {}}
        />
    </Form.Item>
  );
}

InputAnt.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  validateStatus: PropTypes.string,
  size: PropTypes.string,
  getValueFromEvent:PropTypes.bool
};

InputAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  type: "text",
  isRequired: false,
  size: "large",
  trigger: "",
  getValueFromEvent:false,
};
