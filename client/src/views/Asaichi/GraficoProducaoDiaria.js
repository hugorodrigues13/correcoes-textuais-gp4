import * as React from 'react';
import Chart from "react-apexcharts";
import {getMessage} from "../../components/messages";
import "./style.css";
import {useSelector} from "react-redux";
import {Spin} from "antd";

const GraficoProducaoDiaria = () => {
  const {producaoDiaria: graficoData, loadingProducaoDiaria} = useSelector(store => store.asaichi)

  const columnChartData = graficoData && [
    {
    name: getMessage("asaichi.graficos.producao.diaria.produzida.label"),
    data: graficoData.map(t => t.produzido)
    },
    {
      name: getMessage("asaichi.graficos.producao.diaria.previsto.label"),
      data: graficoData.map(t => t.previsto)
    }
  ]

  const options = {
    series: columnChartData,
    chart: {
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
    title: {
      text: getMessage("asaichi.graficos.producao.diaria.label"),
      align: 'center'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10
      },
    },
    xaxis: {
      type: 'category',
      categories: graficoData?.map(t => t.turno)
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
      <Spin tip={"Buscando dados"} spinning={loadingProducaoDiaria}>
        {graficoData && <Chart
          series={options.series}
          options={options}
          type={'bar'}
          height={350}

        />}
      </Spin>
    </div>
  )

}

export default GraficoProducaoDiaria
