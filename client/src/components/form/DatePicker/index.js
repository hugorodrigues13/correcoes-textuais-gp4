import React from "react";
import { Form, DatePicker } from "antd";
import PropTypes from "prop-types";
import locale from 'antd/es/date-picker/locale/pt_BR';

export function DatePickerAnt({
                                     label,
                                     nomeAtributo,
                                     message,
                                     placeholder,
                                     isRequired,
                                     dateFormat,
                                     disabled,
                                     disabledDate,
                                     labelCol,
                                     onChange,
                                     style,
                                     allowClear,
                                     defaultValue,
                                     showTime,
                                   }) {

  return (
    <Form.Item name={nomeAtributo} label={label} labelCol={labelCol} rules={[
      {
        required: isRequired,
        message
      }
    ]}><DatePicker
      size={"large"}
      style={style}
      disabled={disabled}
      disabledDate={disabledDate}
      defaultValue={defaultValue}
      locale={locale}
      format={dateFormat}
      onChange={onChange}
      allowClear={allowClear}
      placeholder={placeholder}
      showTime={showTime}
    />
    </Form.Item>
  );
}

DatePickerAnt.propTypes = {
  placeholder: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dateFormat: PropTypes.string
};

DatePickerAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  dateFormat: "DD/MM/YYYY",
  allowClear: true
};
