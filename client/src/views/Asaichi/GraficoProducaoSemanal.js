import * as React from 'react';
import Chart from "react-apexcharts";
import {getMessage} from "../../components/messages";
import "./style.css";
import {groupBy} from "../../components/utils";
import {useSelector} from "react-redux";
import {Spin} from "antd";

const GraficoProducaoSemanal = () => {
  const {producaoSemanal: graficoData, loadingProducaoSemanal} = useSelector(store => store.asaichi)
  const dataTratada = graficoData && groupBy(graficoData, 'turno')

  const keys = dataTratada && Object.keys(dataTratada)
  const columnChartData = keys && keys.map(key => {
    const datas = dataTratada[key]
    return ({
      name: key,
      type: 'column',
      data: datas.map(t => ({
        x: t.dia,
        y: t.produzido,
        goals: [
          {
            name: getMessage("asaichi.graficos.producao.semanal.previsto.label"),
            value: t.previsto,
            strokeWidth: 5,
            strokeColor: '#FF0000'
          }
        ]
      }))
    });
  })

  const lineChartData = graficoData && {
    name: getMessage("asaichi.graficos.producao.semanal.previsto.label"),
    type: 'line',
    data: Object.values(keys.map(key => dataTratada[key]).flat()
      .map(t => ({dia: t.dia, previsto: t.previsto}))
      .reduce((prev, next) => {
        if (next.dia in prev) {
          prev[next.dia].previsto += next.previsto;
        } else {
          prev[next.dia] = next;
        }
        return prev;
      }, {})).map(t => ({
      x: t.dia,
      y: t.previsto,
    }))
  }

  const options = graficoData && {
    series: [...columnChartData, lineChartData],
    chart: {
      height: 350,
      stacked: true,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
    },
    tooltip: {
      enabled: true,
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [columnChartData.length]
    },
    title: {
      text: getMessage("asaichi.graficos.producao.semanal.label"),
      align: 'center'
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      type: 'category'
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 1
    }
  };

  return (
    <div className={"grafico-container"}>
      <Spin tip={"Buscando dados"} spinning={loadingProducaoSemanal}>
      {graficoData && <Chart
        series={options.series}
        options={options}
        type={'line'}
        height={350}
      />}
      </Spin>
    </div>
  )

}

export default GraficoProducaoSemanal
