import React, { useEffect, useState } from "react";
import { Form, Modal } from "antd";
import { getMessage } from "../../components/messages";
import Alert from "react-s-alert";
import * as moment from "moment";
import FormDividirParadas from "./FormDividirParadas";

export default function ModalDividirParada(props){

    const dateFormat = "DD/MM/YYYY HH:mm:ss"

    const { visible, setVisible, parada, motivos, save } = props;
    const [rangeDates, setRangeDates] = useState({min: null, max: null});
    const [nfForm] = Form.useForm();

    useEffect(() => {

        setRangeDates({
            min: moment(parada?.dataInicioParada, dateFormat),
            max: moment(parada?.dataFimParada, dateFormat)
        })

        nfForm.setFieldsValue({
            periodoParadaOriginal: [moment(parada?.dataInicioParada, dateFormat), moment(parada?.dataInicioParada, dateFormat).add(1, 'seconds')],
            periodoNovaParada: [moment(parada?.dataInicioParada, dateFormat).add(2, 'seconds'), moment(parada?.dataFimParada, dateFormat)]
        })

    }, [parada])

    function handleReset() {
        nfForm.resetFields();
      }

    function validarCampos(...args){
        const camposObrigatorios = ["motivo", "dataInicioParada", "dataFimParada"]
        const camposVazios = []
        args.map(arg =>{
            camposObrigatorios.map( campo =>{
                if(!arg[campo]){
                    const paradaFiltrada = camposVazios.find(e => e.parada === arg.label)
                    if(!paradaFiltrada){
                        camposVazios.push({
                            parada: arg.label,
                            campos: [campo]
                        })
                    }else{
                        paradaFiltrada.campos.push(campo)
                    }
                }
            })
        })
        if(camposVazios.length > 0){
            let templateMsg = getMessage("paradas.dividirParada.campos.camposVazios.label")
            let msg = ""
            camposVazios.map( el => {
                let msgFiltrada = templateMsg.replace("{parada}", el.parada)
                msgFiltrada = msgFiltrada.replace("{campos}", el.campos.map( campo => getMessage(`paradas.${campo}.label`)).join(", "))
                msg += msgFiltrada
            })
            Alert.warning(msg)
            return false
        }
        return true
    }

    function validarDatas(original, novaParada){
        const paradaOriginalPeriodoInvalido = moment(original.dataInicioParada, dateFormat).isBefore(rangeDates.min) || moment(original.dataFimParada, dateFormat).isAfter(rangeDates.max);
        const novaParadaPeriodoInvalido = moment(original.dataInicioParada, dateFormat).isBefore(rangeDates.min) || moment(novaParada.dataFimParada, dateFormat).isAfter(rangeDates.max);
        const novaParadaComecaAntesDaOrinal = moment(novaParada.dataInicioParada, dateFormat).isBefore(moment(original.dataFimParada, dateFormat))
        const intervalo = `${moment(rangeDates.min).format(dateFormat)} - ${moment(rangeDates.max).format(dateFormat)}`

        if(paradaOriginalPeriodoInvalido || novaParadaPeriodoInvalido){
            const msg = getMessage("paradas.paradasForaDointervalor.label").replace("{intervalo}", intervalo)
            Alert.warning(msg)
            return false
        }

        if(novaParadaComecaAntesDaOrinal){
            Alert.warning(getMessage("paradas.erro.horarioInicialNovaParada.label"))
            return false
        }

        return true
    }

    function onFinish(){
        const original = {
            label: getMessage("paradas.ParadaOriginal.label"),
            id: parada.id,
            motivo: nfForm.getFieldValue("motivoParadaOriginal"),
            dataInicioParada: moment(nfForm.getFieldValue("periodoParadaOriginal")[0]).format(dateFormat),
            dataFimParada: moment(nfForm.getFieldValue("periodoParadaOriginal")[1]).format(dateFormat)
        }
        const novaParada = {
            label: getMessage("paradas.NovaParada.label"),
            motivo: nfForm.getFieldValue("motivoNovaParada"),
            dataInicioParada: moment(nfForm.getFieldValue("periodoNovaParada")[0]).format(dateFormat),
            dataFimParada: moment(nfForm.getFieldValue("periodoNovaParada")[1]).format(dateFormat)
        }   

        const justificativa = nfForm.getFieldValue("justificativa")

        if(validarCampos(original, novaParada)){
            if(!justificativa) {
                Alert.warning(getMessage("paradas.justificativa.obrigatorio.label"));
                return
            }
            if(validarDatas(original, novaParada)){
                const data = { original, novaParada, justificativa }
                save(data)
                setVisible(false)
            }
        }
    }
    
    return (
        <Modal
            title={getMessage("paradas.title.modalDividirParada.label")}
            visible={visible}
            onCancel={() => { setVisible(false); handleReset() }}
            onOk={onFinish}
            destroyOnClose={true}
            width={700}
        >
            <FormDividirParadas 
                motivos={motivos}
                nfForm={nfForm}
                dateFormat={dateFormat} 
                rangeDates={rangeDates}
            />
        </Modal>
    )

}