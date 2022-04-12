import * as React from 'react';
import Chart from "react-apexcharts";
import {getMessage} from "../../components/messages";
import "./style.css";
import * as moment from "moment";
import {groupBy} from "../../components/utils";
import {Button, Checkbox, Popover, Spin} from "antd";
import {AiFillFilter} from "react-icons/all";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const GraficoDefeitosTri = ({dia}) => {
  const {graficoDefeitos: graficoData, loadingGraficoDefeitos} = useSelector(store => store.asaichi)
  const [defeitosVisiveis, setDefeitosVisiveis] = useState([])
  const dataTratada = graficoData && groupBy(graficoData.dados, 'dia')
  const defeitos = graficoData && [...new Set(graficoData.dados.map(t => t.defeito))]
  const diaAtual = dia.format("DD/MM/YYYY")

  useEffect(() => {
    setDefeitosVisiveis(defeitos||[])
  }, [graficoData])

  const somar = (a, b) => (a + b);

  const sortByQntdDoDiaAtual = (def1, def2) => {
    const dados1 = graficoData.dados.filter(d => d.defeito === def1)
    const dados2 = graficoData.dados.filter(d => d.defeito === def2)
    const qntd1 = dados1.filter(d => d.dia === diaAtual).map(d => d.quantidade).reduce(somar, 0)
    const qntd2 = dados2.filter(d => d.dia === diaAtual).map(d => d.quantidade).reduce(somar, 0)
    return qntd2 - qntd1
  }

  const columnChartData = graficoData && Object.keys(dataTratada)
    .map(key => {
      const dados = dataTratada[key]
      const dadosByDefeito = groupBy(dados, 'defeito')
      return ({
        name: key,
        data: Object.keys(dadosByDefeito)
          .filter(d => defeitosVisiveis.includes(d))
          .sort(sortByQntdDoDiaAtual)
          .map(dKey => {
            return ({
              x: dKey,
              y: dadosByDefeito[dKey].map(def => def.quantidade).reduce(somar, 0),
              turnos: dadosByDefeito[dKey].filter(d => d.turno).map(def => ({turno: def.turno, quantidade: def.quantidade}))
            });
          })
      });
    })

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
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const dia = w.globals.initialSeries[seriesIndex].name

        return '<div>' +
           '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">'+ dia + ' -  ' + data.x +'</div>' +
            ['total', ...data.turnos.map(t => t.turno)].map((key, index) => (
              ' <div class="apexcharts-tooltip-series-group apexcharts-active" style="order: '+(index+1)+'; display: flex;">' +
              '<span class="apexcharts-tooltip-marker" style="background-color: rgb(0, 143, 251);"></span>' +
              '<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">' +
              ' <div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">'+(index === 0 ? getMessage("asaichi.graficos.defeitos.total.label") : key)+': </span><span ' +
              'class="apexcharts-tooltip-text-y-value">'+(index === 0 ? data.y : data.turnos.find(t => t.turno === key).quantidade)+'</span></div>' +
              '<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span ' +
              'class="apexcharts-tooltip-text-goals-value"></span></div>' +
              '<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span ' +
              'class="apexcharts-tooltip-text-z-value"></span></div>' +
              '</div>' +
              '</div>'
            )).join(" ") +
          '</div>'
      }
    },
    title: {
      text: getMessage("asaichi.graficos.defeitos.label"),
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
      categories: [...new Set(graficoData?.dados?.map(t => t.defeito))]
        .filter(d => defeitosVisiveis.includes(d))
        .sort(sortByQntdDoDiaAtual)
    },
    legend: {
      position: 'right',
      offsetY: 40,
    },
    fill: {
      opacity: 1
    }
  };

  function renderFiltro(){
    function renderContent(){
      function setVisivel(defeito){
        if (defeitosVisiveis.includes(defeito)){
          const index = defeitosVisiveis.indexOf(defeito)
          const newDefeitos = [...defeitosVisiveis]
          newDefeitos.splice(index, 1)
          setDefeitosVisiveis(newDefeitos)
        } else {
          setDefeitosVisiveis([...defeitosVisiveis, defeito])
        }
      }
      return defeitos.map(defeito => (
        <li>
          <Checkbox checked={defeitosVisiveis.includes(defeito)} onChange={() => setVisivel(defeito)}>
            {defeito}
          </Checkbox>
        </li>
      ))
    }
    return (
      <Popover
        placement="right"
        trigger="click"
        content={renderContent()}
        >
        <Button className="grafico-filtro">
          <AiFillFilter size={20}/>
        </Button>
      </Popover>
    )
  }

  return (
    <div className={"grafico-container"}>
      <Spin tip={"Buscando dados"} spinning={loadingGraficoDefeitos}>
        {graficoData && (
          <>
          <span className="grafico-legenda-media-mensal">
            {getMessage("asaichi.graficos.defeitos.mediaMensal.label")}
            {graficoData.mediaMensal}%
          </span>
            {renderFiltro()}
            <Chart
              series={options.series}
              options={options}
              type={'bar'}
              height={350}/>
          </>
        )}
      </Spin>
    </div>
  )

}

export default GraficoDefeitosTri
