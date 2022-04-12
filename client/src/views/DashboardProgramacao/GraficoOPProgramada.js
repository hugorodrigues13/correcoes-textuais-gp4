import React, {useEffect} from "react";
import Chart from 'react-apexcharts';
import {useDispatch, useSelector} from "react-redux";
import * as moment from "moment";
import {DatePickerAnt} from "../../components/form/DatePicker";
import {Spin} from "antd";

export default function GraficoOPProgramada(props) {

    const dispatch = useDispatch()
    const optionsPie = {
      labels: ["Pendente", "Produzido"],
      legend: {
          show: true,
          position: "bottom"
      },
      colors: ["#F6F442", "#80EB4B"],
      pie: {
        expandOnClick: true,
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10
          },
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: undefined,
                offsetY: -5,
                formatter: function (val) {
                  return val
                }
              },
              value: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: undefined,
                offsetY: 8,
                formatter: function (val) {
                  return val
                }
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                }
              }
            }
          },
        }
      },
    }
    const { getMessage } = props;
    const hasOrdens = props.quantidade && props.quantidade.length && props.quantidade.some(q => q)

    return (
      <Spin tip={"Buscando dados"} spinning={props.loadingGraficos}>
        <div className={"div-chart-sem-OP"}>
            {
                hasOrdens ?
                    <Chart
                        options={optionsPie}
                        labels={["Pendente", "Produzido"]}
                        series={props.quantidade}
                        legend={{show: true, position: "bottom"}}
                        type="donut" height={320}/>
                        : ""

            }
          {
            !hasOrdens ?
            <div className={"div-alerta-sem-OP"}>
              { props.loadingGraficos ? "" : getMessage("dashboardProgramacao.nenhumDadoEncontrado.label")}
            </div> : ""
          }
        </div>
      </Spin>
    )
}
