import React, {useState} from "react";
import {useDrag} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {Button, Modal, Tooltip} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {
  buscarSerialSelecionadoRequest,
  redirecionarSerialRequest,
  descartarSerialRequest, buscarGrupoLinhasDeProducaoRequest,
} from "../../../store/modules/Apoio/action";
import {FormattedMessage} from "react-intl";

export default function Produto({produto}) {
  const {serialSelecionado, grupoLinhaSelecionada} = useSelector(store => store.apoio)
  const linhaSelecionada = serialSelecionado.linhaDeProducao || {}
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [entity, setEntity] = useState(null);

  const [{isDragging}, drag] = useDrag({
    item: {id: produto.id, name: produto.serial, type: ItemTypes.PRODUTO},

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      const didDrop = monitor.didDrop();

      if (didDrop) {
        if (dropResult.id === "Trash") {
          setShowModal(true);
          setEntity({remover: {item: item, linhaSelecionada: linhaSelecionada}});
          dropResult.callback();
        } else {
          setShowModal(true);
          setEntity({redirecionar: {item: item, processo: dropResult, linhaSelecionada: linhaSelecionada}});
        }
      }
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  function onOk(props) {
    console.log(props)
    if (props?.remover) {
      dispatch(descartarSerialRequest(props.remover.item.id, grupoLinhaSelecionada.id));
      setShowModal(false);
    } else {
      const serial = {
        id: props.redirecionar.item.id,
        redirecionarAoProcesso: props.redirecionar.processo.id
      }
      dispatch(redirecionarSerialRequest(serial, grupoLinhaSelecionada.id));
      setShowModal(false);
    }
  }

  function handleSelectSerial(produto, dragging) {
    if (!dragging || serialSelecionado?.id !== produto.id){
      dispatch(buscarSerialSelecionadoRequest(produto.id))
    }
  }

  return (
    <>
      <Tooltip placement="top" title={produto.descricao}>
        <div
          ref={drag}
          className={`draggable-serial ${produto.id === serialSelecionado?.id ? "serial-selecionado" : ""}`}
          onClick={() => handleSelectSerial(produto, false)}
          onDragStart={() => handleSelectSerial(produto, true)}
        >
          {`${produto.serial}`}
        </div>
      </Tooltip>

      <Modal
        visible={showModal}
        title={<FormattedMessage id={`${entity?.redirecionar ? "apoio.modal.redirecionar.label" : "apoio.modal.remover.label"}`}/>}
        onCancel={() => setShowModal(false)}
        destroyOnClose={true}
        footer={[
          <Button
            type={"primary"}
            onClick={() => onOk(entity)}
          >
            <FormattedMessage id={"comum.ok.label"}/>
          </Button>,
          <Button
            type={"ghost"}
            onClick={() => setShowModal(false)}
          >
            <FormattedMessage id={"comum.cancelar.label"}/>
          </Button>
        ]}
      >
        <p>{entity && entity?.redirecionar ? `Redirecionar o serial ${entity?.redirecionar.item.name} para o processo ${entity?.redirecionar.processo.name}?` : `Deseja realmente descartar o serial ${entity?.remover.item.name}?`}</p>
      </Modal>
    </>
  )
}
