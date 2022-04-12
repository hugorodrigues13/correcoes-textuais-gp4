import * as React from 'react';
import {Button, Col, Row, Spin} from "antd";
import "./style.css";
import {getMessage} from "../../components/messages";
import {useState} from "react";
import {AiOutlineDown, AiOutlineRight} from "react-icons/all";

export const TabelaAsaichi = ({prefixo, titulo,rows, cols, colRender, data, small, loading}) => {
  const [expanded, setExpanded] = useState(true)

  function renderTitulo(){
    return (
      <div className={'data-title'} onClick={() => setExpanded(!expanded)}>
        {getMessage(titulo)}
        <div style={{position: 'absolute', top: 2, right: 20}}>
          {expanded
            ? <AiOutlineDown/>
            : <AiOutlineRight/>
          }
        </div>
      </div>
    )
  }

  function renderTabela(){
    function renderCabecalho(){
      return (
        <tr>
          {cols.map((col, colIndex) => (
            <>
              {colIndex === 0 && <td className={`data-cell ${small && 'small'}`}>
                <span>#</span>
              </td>}
              <td className={`data-cell ${small && 'small'}`}>
                <span>{col.startsWith('#') ? col.replace('#', '') : getMessage(`${prefixo}${col}.label`)}</span>
              </td>
            </>
          ))}
        </tr>
      )
    }
    function renderData(row, col){
      const colData = data?.find(d => d.key === col.replace('#', ''))
      return (
        <td className={`data-cell ${small && 'small'}`}>
          <span>{colData ? colRender ?  colRender(row, colData[row]) : colData[row] : '-'}</span>
        </td>
      );
    }

    return (
      <table style={{tableLayout: 'fixed', width: '100%'}}>
        <tbody>
        {rows.map((row, index) => (
          <>
            {index === 0 && renderCabecalho()}
            <tr>
              <td className={`data-cell ${small && 'small'}`}>
                <span>
                  {row.startsWith('#') ? row.replace('#', '') : getMessage(`${prefixo}${row}.label`)}
                </span>
              </td>
              {cols.map(col => renderData(row, col))}
            </tr>
          </>
        ))}
        </tbody>
      </table>
    )
  }

  return (
    <Spin tip={"Buscando dados"} spinning={loading}>
      {renderTitulo()}
      {expanded && renderTabela()}
    </Spin>
  )

}

export default TabelaAsaichi
