import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select } from "antd";
import { RangeDatePickerAnt } from "../../components/form/RangeDatePicker";
import TextArea from "antd/lib/input/TextArea";
import { getMessage } from "../../components/messages";
import * as moment from "moment";

export default function FormDividirParadas({nfForm, dateFormat, motivos, rangeDates}){

    const [dataMinima, setDateMIn] = useState()
    const [dataMaxima, setDateMax] = useState()

    
    useEffect(() => {
        setDateMIn(rangeDates.min)
        setDateMax(rangeDates.max)
    })

    function onFieldChange(attr, val){
        const field = {}
        field[attr] = val
        nfForm.setFieldsValue(field)
    }

    function onChange(el, attr){
        onFieldChange(attr, el.target.value)
    }

    function onChangeCalendar(){
        const novaParadaInicial = nfForm.getFieldValue("periodoParadaOriginal")[1].add(1, 'seconds')
        const novaParadaFinal = nfForm.getFieldValue("periodoNovaParada")[1]
        nfForm.setFieldsValue({
            periodoNovaParada: [novaParadaInicial, novaParadaFinal]
        })
    }

    function escolherMotivo(atributo){
        return (
            <Select
                size="large"
                style={{width: '100%'}}
                placeholder={getMessage("paradas.MotivoDeParada.label")}
                onChange={(val) => onFieldChange(atributo, val)}
            >
                {(motivos || []).map(registro => (
                    <Option
                        key={registro.id}
                        value={registro.id}
                    >
                    {registro.motivo}
                    </Option>
                ))}
            </Select>
        )
    }

    function getRangeTime(start, end) {
        const arrayKeys = [...Array((end - start ) + 1).keys()];
        const range = arrayKeys.map(index => index + start)
        return range 
    }

    function disabledDate(current){
        if(!current) return null
        const isBeforeMin = current.isBefore(dataMinima) && !current.isSame(dataMinima, 'day')
        const isAfterMax = current.isAfter(dataMaxima) && !current.isSame(dataMaxima, 'day')
        const isAfterOrBeforeRange = isBeforeMin || isAfterMax
        return isAfterOrBeforeRange
    }
    function disabledTime(current){
        if(!current) return null

        if(current.isSame(dataMinima, 'day') && current.isSame(dataMaxima, 'day')){
            return {
                disabledHours: () => dataMinima.hour() > 0 ? [...getRangeTime(0, dataMinima.hour()), ...getRangeTime(dataMaxima.hour(), 24)] : [],
                disabledMinutes: (hour) => (hour === dataMinima.hour() && dataMinima.minutes() > 0) ? [...getRangeTime(0, dataMinima.minutes()), ...getRangeTime(dataMaxima.minutes(), 60)] : [],
                disabledSeconds: (hours, minutes) => (minutes === dataMinima.minutes() && dataMinima.seconds() > 0) ? [...getRangeTime(0, dataMinima.seconds()), ...getRangeTime(dataMaxima.seconds()-1, 60)] : []
            }
        } else if(current.isSame(dataMinima, 'day')){
            return {
                disabledHours: () => dataMinima.hour() > 0 ? getRangeTime(0, dataMinima.hour() -1) : [],
                disabledMinutes: (hour) => (hour === dataMinima.hour() && dataMinima.minutes() > 0) ? getRangeTime(0, dataMinima.minutes() -1) : [],
                disabledSeconds: (hours, minutes) => (minutes === dataMinima.minutes() && dataMinima.seconds() > 0) ? getRangeTime(0, dataMinima.seconds()) : []
            }
        } else if(current.isSame(dataMaxima, 'day')) {
            return {
                disabledHours: () => getRangeTime(dataMaxima.hour() + 1, 24),
                disabledMinutes: (hour) => hour === dataMaxima.hour() ? getRangeTime(dataMaxima.minutes() + 1, 60) : [],
                disabledSeconds: (hour, minutes) => minutes === dataMaxima.minutes() ? getRangeTime(dataMaxima.seconds()-1, 60) : []
            }
        }
    }

    return( 
        <Form form={nfForm} layout={"horizontal"}>
            <Row gutter={24} style={{marginBottom: '8px'}}>
                <Col>
                    {getMessage("paradas.ParadaOriginal.label")}
                </Col>
            </Row>
            <Row gutter={24} style={{alignItems: 'baseline'}}>
                <Col span={9} >
                    {escolherMotivo("motivoParadaOriginal")}
                </Col>
                <Col span={15}>
                    <RangeDatePickerAnt
                        isRequired
                        placeholder={["Inicio", "Fim"]}
                        nomeAtributo="periodoParadaOriginal"
                        message={getMessage("comum.obrigatorio.campo.message")}
                        dateFormat={dateFormat}
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                        showTime={true}
                        disabled={[true, false]}
                        onChange={onChangeCalendar}
                    />
                </Col>
            </Row>
            <Row gutter={24} style={{marginBottom: '8px'}}>
                <Col>
                    {getMessage("paradas.NovaParada.label")}
                </Col>
            </Row>
            <Row gutter={24} style={{alignItems: 'baseline'}}>
                <Col span={9}>
                        {escolherMotivo("motivoNovaParada")}
                </Col>
                <Col span={15}>
                    <RangeDatePickerAnt
                        isRequired
                        placeholder={["Inicio", "Fim"]}
                        nomeAtributo="periodoNovaParada"
                        message={getMessage("comum.obrigatorio.campo.message")}
                        dateFormat={dateFormat}
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                        showTime={true}
                        disabled={[true, true]}
                    />
                </Col>
            </Row>
            <Row gutter={24} style={{marginBottom: '8px'}}>
                <Col>
                    {getMessage("comum.justificativa.label")}
                </Col>
            </Row>
            <Row gutter={24} style={{alignItems: 'baseline'}}>
                <Col span={24}>
                    <TextArea
                        required
                        placeholder={getMessage("comum.insiraJustificativa.label")}
                        message={getMessage("comum.obrigatorio.campo.message")}
                        nomeAtributo="justificativa"
                        onChange={(el) => onChange(el, "justificativa")}
                    />
                </Col>
            </Row>
        </Form>
    )
} 