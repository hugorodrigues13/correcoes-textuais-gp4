import React from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const { TextArea } = Input;
export function TextAreaAnt({
  label,
  nomeAtributo,
  message,
  placeholder,
  isRequired,
  getFieldDecorator,
  rows,
  onChange,
  maxLength,
  showCount
}) {
  return (
    <Form.Item label={label}>
      {getFieldDecorator(nomeAtributo, {
        rules: [
          {
            required: isRequired,
            message
          }
        ]
      })(<TextArea maxLength={maxLength} showCount={showCount} rows={rows} placeholder={placeholder} onChange={onChange} />)}
    </Form.Item>
  );
}

TextAreaAnt.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCount: PropTypes.bool
};

TextAreaAnt.defaultProps = {
  placeholder: "",
  rows: 4,
  onChange:null
};
