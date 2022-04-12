import React from "react";
import {Form, DatePicker, TimePicker} from "antd";
import PropTypes from "prop-types";
import locale from 'antd/es/date-picker/locale/pt_BR';

export function RangeTimePickerAnt({
  label,
  nomeAtributo,
  message,
  placeholder,
  isRequired,
  dateFormat,
  disabled,
  labelCol,
  disabledDate,
  onCalendarChange,
  showTime
}) {
  const { RangePicker } = DatePicker;
  return (
    <Form.Item name={nomeAtributo} label={label} labelCol={labelCol} rules={[
      {
        required: isRequired,
        message
      }
    ]}><TimePicker.RangePicker
          size={"large"}
          disabled={disabled}
          locale={locale}
          format={dateFormat}
          disabledDate={disabledDate}
          onCalendarChange={onCalendarChange}
          placeholder={placeholder}
        />
    </Form.Item>
  );
}

RangeTimePickerAnt.propTypes = {
  placeholder: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  message: PropTypes.string,
  nomeAtributo: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dateFormat: PropTypes.string
};

RangeTimePickerAnt.defaultProps = {
  placeholder: "",
  disabled: false,
  dateFormat: "HH:mm"
};
