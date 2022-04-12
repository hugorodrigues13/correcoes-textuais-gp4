import React, {useEffect} from "react";
import Chart from 'react-apexcharts';
import {useSelector} from "react-redux";
import {Spin} from "antd";

export default function ProducaoUltimas24Horas({}) {
    const optionsLine = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        colors: ['#000000'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        markers: {
            size: 5,
        },
        title: {
            text: undefined,
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
    }

    const dashboardProducao = useSelector(store => store.dashboardProducao)
    const {seriaisApontadosNasUltimas24Horas, loadingUltimas24Horas} = dashboardProducao

    return (
        <Spin tip={"Buscando dados"} spinning={loadingUltimas24Horas}>
            <Chart
                options={optionsLine}
                series={[{name: "Quantidade", data: seriaisApontadosNasUltimas24Horas.map(dadoHora => ({x: dadoHora.hora, y: dadoHora.quantidade}))}]}
                height={320}
            />
        </Spin>
    )
}
