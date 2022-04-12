import * as React from 'react';
import {useEffect, useState} from "react";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import {Button, PageHeader, Spin} from "antd";
import {FormattedMessage} from "react-intl";
import {useSelector} from "react-redux";
import Spinner from "../../components/Spinner";
import AgruparLotes from "./AgruparLotes";
import DividirLotes from "./DividirLotes";

const AGRUPAR = 'agrupar'
const DIVIDIR = 'dividir'

function TransformacaoLoteForm() {

  const { loading } = useSelector(store => store.requestManager)
  const { lotesInfo } = useSelector(store => store.transformacaoLote)

  const [tipo, setTipo] = useState(AGRUPAR)

  useEffect(() => {
    document.title = getMessage("transformacaoLote.title.label")
  }, [])

  function renderExtra(){
    return [
      <Button
        type={tipo === DIVIDIR && 'primary'}
        onClick={() => setTipo(DIVIDIR)}
        className="page-header-ignored-button"
      >
        {getMessage("transformacaoLote.dividirLotes.label")}
      </Button>,
      <Button
        type={tipo === AGRUPAR && 'primary'}
        onClick={() => setTipo(AGRUPAR)}
        className="page-header-ignored-button"
      >
        {getMessage("transformacaoLote.agruparLotes.label")}
      </Button>,
    ]
  }

  return (
    <>
      <PageHeader
        onBack={() => history.push(CLIENT_URL + "/prod")}
        title={getMessage("transformacaoLote.title.label")}
        extra={renderExtra()}
      />
      <Spin spinning={loading}>
        {tipo === AGRUPAR && <AgruparLotes lotesInfo={lotesInfo} loading={loading} visible={tipo === AGRUPAR}/>}
        {tipo === DIVIDIR && <DividirLotes lotesInfo={lotesInfo} loading={loading} visible={tipo === DIVIDIR}/>}
      </Spin>
    </>
  )
}

export default TransformacaoLoteForm
