import React, {useEffect} from "react";
import Chart from 'react-apexcharts';
import {useDispatch, useSelector} from "react-redux";
import * as moment from "moment";
import {DatePickerAnt} from "../../components/form/DatePicker";
import {Spin} from "antd";

export default function StatusDosSeriais({}) {
    const dispatch = useDispatch()
    const optionsPie = {
        labels: ["Apontamento Iniciado", "Pendente Apoio", "Apontamento Finalizado", "Sucateado"],
        legend: {
            show: true,
            position: "bottom"
        },
        colors: ["#008ffb", "#feb019", "#00e396", "#ff4560"]
    }

    const dashboardProducao = useSelector(store => store.dashboardProducao)
    const {statusSeriais, loadingStatusSeriais} = dashboardProducao
    const quantidades = statusSeriais.map(a => a.quantidade)

    return (
        <Spin tip={"Buscando dados"} spinning={loadingStatusSeriais}>
        <div className={"div-chart-status-seriais"}>
            {
                quantidades && quantidades.length && quantidades.some(q => q) ?
                    <Chart
                        options={optionsPie}
                        labels={["Apontamento Iniciado", "Pendente Apoio", "Apontamento Finalizado", "Sucateado"]}
                        series={quantidades}
                        legend={{show: true, position: "bottom"}}
                        type="pie" height={320}/> :
                    <div className={"div-alerta-sem-seriais"}>
                        Nenhum serial encontrado para o período informado.
                    </div>
            }

        </div>
        </Spin>
    )
}
