import * as React from 'react';
import Chart from "react-apexcharts";
import {getMessage} from "../../components/messages";
import "./style.css";
import {useSelector} from "react-redux";
import {Spin} from "antd";

const GraficoProducaoMensal = ({data}) => {
  const {producaoMensal: graficoData, loadingProducaoMensal} = useSelector(store => store.asaichi)

  const dataTratada = []

  graficoData && graficoData.forEach((d, index) => {
    const previous = dataTratada[index - 1]
    dataTratada.push({
      ...d,
      previsto: d.previsto + (previous?.previsto || 0),
      acumulado: d.acumulado  + (previous?.acumulado || 0),
    })
  })

  const columnChartData = graficoData && ['previsto', 'acumulado', 'defeitos', 'metaDefeitos'].map(key => ({
    name: getMessage(`asaichi.graficos.producao.mensal.${key}.label`),
    type: 'line',
    data: dataTratada.map(t => ({
      x: t.dia,
      y: t[key],
    }))
  }))

  const options = {
    series: columnChartData,
    chart: {
      height: 350,
      stacked: false,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true
      },
    },
    tooltip: {
      enabled: true,

    },
    title: {
      text: getMessage("asaichi.graficos.producao.mensal.label"),
      align: 'center'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10
      },
    },
    xaxis: {
      type: 'category'
    },
    yaxis: [
      {
        seriesName: getMessage(`asaichi.graficos.producao.mensal.previsto.label`),
        labels: {
          formatter: (value) => { return value?.toFixed(0) },
        }
      },
      {
        seriesName: getMessage(`asaichi.graficos.producao.mensal.previsto.label`),
        show: false,
        labels: {
          formatter: (value) => { return value.toFixed(0) },
        },
      },
      {
        seriesName: getMessage(`asaichi.graficos.producao.mensal.defeitos.label`),
        opposite: true,
        labels: {
          formatter: (value) => { return (value || 0).toFixed(2) + '%' },
        }
      },
      {
        seriesName: getMessage(`asaichi.graficos.producao.mensal.defeitos.label`),
        opposite: true,
        show: false,
        labels: {
          formatter: (value) => { return value === 0 ? '0%' : value.toFixed(2) + '%' },
        }
      }
    ],
    legend: {
      position: 'right',
      offsetY: 60,
    },
    fill: {
      opacity: 1
    },
  };

  const diferenca = dataTratada.length ?
    dataTratada.find(d => d.dia === data)?.acumulado - dataTratada.find(d => d.dia === data)?.previsto : 0

  return (
    <div className={"grafico-container"}>
      <Spin tip={"Buscando dados"} spinning={loadingProducaoMensal}>
        {graficoData && (<>
         <span className="grafico-legenda-extra">
            {getMessage("asaichi.graficos.producao.mensal.diferenca.label")}
           {diferenca} UN
          </span><br/>
          <span className="grafico-legenda-extra-ref">
            {getMessage("asaichi.graficos.producao.mensal.ref.label")}
            {data}
          </span>
          <Chart
            series={options.series}
            options={options}
            type={'line'}
            height={350}
          />
        </>)}
      </Spin>
    </div>
  )

}

export default GraficoProducaoMensal
