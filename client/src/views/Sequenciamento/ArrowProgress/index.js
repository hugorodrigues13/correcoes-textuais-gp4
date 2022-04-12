import React, {useEffect, useState} from "react";
import {FaWarehouse} from "react-icons/all";
import {Col, InputNumber, Tooltip} from "antd";
import {getMessage} from "../../../components/messages";
import {InputNumberAnt} from "../../../components/form/InputNumber";

export default function Index({entity, percent, ordemInicial, setOrdemInicial}) {

    const [stop1, setStop1] = useState("0")
    const [stop2, setStop2] = useState("0")

  useEffect(() => {
        setProgress(percent);
    }, [percent]);

    function setProgress(amt) {
        amt = (amt < 0) ? 0 : (amt > 1) ? 1 : amt;
        setStop1(amt.toString())
        setStop2(amt.toString())
    }

    return (
        <svg
            id={entity.key}
            xmlns="http://www.w3.org/2000/svg"
            width="182.47"
            height="73"
            viewBox="0 0 182.47 73"
        >
            <defs>
                <linearGradient id={`progress${entity.codigo}`}  x1="0" y1="0" x2="1" y2="0">
                    <stop offset={stop1} stopColor={"lightgreen"}/>
                    <stop offset={stop2} stopColor={"white"}/>
                </linearGradient>
            </defs>
            <g
                id="seta"
                data-name="seta"
                fill={"#FFF"}
            >

                <path
                    d="M 159.8255310058594 72 L 1.780702114105225 72 L 22.93700218200684 37.29233932495117 L 23.25190353393555 36.77571868896484 L 22.94040298461914 36.25701904296875 L 1.767010807991028 1 L 159.8211975097656 1 L 181.3014526367188 36.76799392700195 L 159.8255310058594 72 Z"
                    stroke={ordemInicial == entity.ordem * 10 ? "#CCC" : "#2aabd2"}
                    fill={`url(#progress${entity.codigo})`}
                />
              <text className={"text-ordem-codigo"} x="130" y="42">{entity.codigo}</text>
              <text className={"text-ordem-quantidade"} x="105" y="62">{entity.quantidadeFinalizada}/{entity.quantidadeTotal}</text>
                <text className={"text-ordem-data"} x="109" y="23">{entity.dataPrevisaoFinalizacao}</text>
              {entity.status === 'EM_SEPARACAO' &&
              <Tooltip placement="top" title={getMessage("sequenciamento.emSeparacao.label")}>
                  <FaWarehouse size={18} x={115} y={46}  />
              </Tooltip>
              }
            </g>
        </svg>
    )
}
