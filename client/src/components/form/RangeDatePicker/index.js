import React from "react";
import { Form, DatePicker } from "antd";
import PropTypes from "prop-types";
import locale from 'antd/es/date-picker/locale/pt_BR';

export function RangeDatePickerAnt({
  label,
  nomeAtributo,
  message,
  placeholder,
  isRequired,
  dateFormat,
  disabled,
  labelCol,
  disabledDate,
  disabledTime,
  onCalendarChange,
  onChange,
  showTime,
  rules,
  picker
}) {
  const { RangePicker } = DatePicker;
  return (
    <Form.Item name={nomeAtributo} label={label} labelCol={labelCol} rules={[
      {
        required: isRequired,
        message
      },
      ...(rules || [])
    ]}><RangePicker
          size={"large"}
          disabled={disabled}
          locale={locale}
          format={dateFormat}
          disabledDate={disabledDate}
          disabledTime={disabledTime}
          onCalendarChange={onCalendarChange}
          onChange={onChange}
          showTime={showTime}
          placeholder={placeholder}
          picker={picker}
        />
    </Form.Item>
  );
}

RangeDatePickerAnt.propTypes = {
  placeholder: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dateFormat: PropTypes.string
};

RangeDatePickerAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  dateFormat: "DD/MM/YYYY",
  picker: "date",
};
