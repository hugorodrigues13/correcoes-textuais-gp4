import React from "react";
import {Form, DatePicker, TimePicker} from "antd";
import PropTypes from "prop-types";
import locale from 'antd/es/date-picker/locale/pt_BR';

export function TimePickerAnt({
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
                                     showNow
                                   }) {

  return (
    <Form.Item name={nomeAtributo} label={label} labelCol={labelCol} rules={[
      {
        required: isRequired,
        message
      }
    ]}><TimePicker
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
      showNow={showNow}
    />
    </Form.Item>
  );
}

TimePickerAnt.propTypes = {
  placeholder: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dateFormat: PropTypes.string
};

TimePickerAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  dateFormat: "HH:mm",
  allowClear: true
};
