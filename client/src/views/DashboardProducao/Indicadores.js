import React, {useEffect} from "react";
import Chart from 'react-apexcharts';
import {useSelector} from "react-redux";
import {Row, Spin} from "antd";

export default function Indicadores({}) {
    const dashboardProducao = useSelector(store => store.dashboardProducao)
    const {lotesAbertos, lotesFechados, loadingIndicadores} = dashboardProducao

    return (
        <>
            <Spin tip={"Buscando dados"} spinning={loadingIndicadores}>
            <div className="box aberto">
                <img
                    className="icon"
                    alt="logo"
                    src={require("../../images/icon-romaneio02.png")}
                />
                <div className="info">
                    <p>{lotesAbertos}</p>
                    <p>Lotes Abertos</p>
                </div>
            </div>
            </Spin>
            <Spin tip={"Buscando dados"} spinning={loadingIndicadores}>
            <div className="box fechado">

                <img
                    className="icon"
                    alt="logo"
                    src={require("../../images/icon-romaneio01.png")}
                />
                <div className="info">
                    <p>{lotesFechados}</p>
                    <p>Lotes Fechados</p>

                </div>

            </div>
        </Spin>
        </>
    )
}