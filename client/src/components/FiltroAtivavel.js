import * as React from 'react';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsuarioColunasRequest, setUsuarioColunasRequest} from "../store/modules/User/action";
import PropTypes, {array, func, string} from "prop-types";
import {Button, Checkbox, Popover, Spin, Row, Divider} from "antd";
import {AiFillFilter} from "react-icons/all";
import {getMessage} from "./messages";

function FiltroAtivavel(props) {

  const dispatch = useDispatch();
  const userManager = useSelector(state => state.users);
  const requestManager = useSelector(state => state.requestManager);
  const { colunas } = userManager
  const [visibleAll, setVisibleAll] = useState(false)

  useEffect(() => {
      setVisibleAll(props.campos.every(c => c.visible))
  }, [props])

  useEffect(() => {
    dispatch(getUsuarioColunasRequest(props.tipo))
  }, [])

  useEffect(() => {
    if (colunas?.length){
      props.campos.forEach(campo => campo.visible = colunas.includes(campo.key))
    }
  }, [colunas])



  function salvarColunas(){
    const newColunas = props.campos.filter(c => c.visible).map(c => c.key)
    dispatch(setUsuarioColunasRequest(props.tipo, newColunas))
  }

  return (
    <Popover
      placement="right"
      trigger="click"
      content={
        <div>
          <Spin spinning={requestManager.loading}>
            {props.campos.map((coluna) => (
              <li>
                <Checkbox checked={coluna.visible} onChange={() => {
                  props.setVisible(coluna)
                  if(!coluna.visible){
                    setVisibleAll(false)
                  }
                }}>
                  {coluna.value}
                </Checkbox>
              </li>
            ))}
            {props.selecionarTodos ? <>
            <Divider style={{margin: '10px 0'}}/>
            <Checkbox checked={visibleAll} onChange={() => {
              setVisibleAll(!visibleAll)
              props.toggleAll(!visibleAll)
            }}>
              {getMessage("comum.selecionarTodos.label")}
            </Checkbox></> : ""
            }
            <Row>
              <Button style={{marginTop: 10}} type="primary" onClick={salvarColunas}>
                {getMessage("comum.salvar.label")}
              </Button>
            </Row>
          </Spin>
        </div>
      }
    >
      <Button>
        <AiFillFilter size={15} />
      </Button>
    </Popover>
  )

}

FiltroAtivavel.propTypes = {
  tipo: string.isRequired,
  setVisible: func.isRequired,
  campos: array.isRequired,
};

export default FiltroAtivavel
