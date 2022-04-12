import * as React from 'react';
import {Checkbox, Divider, Tooltip} from "antd";
import {getMessage} from "../../../components/messages";
import {AiOutlineDrag, GrDrag, MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/all";
import {ItemTypes} from "../ItemTypes";
import {useDrag, useDrop} from "react-dnd";
import {alterarOrdemRequest} from "../../../store/modules/Sequenciamento/action";
import {useRef} from "react";
const setaProps = {
  size: 16,
  style: {marginLeft: 5}
}
function OrdenarSelect(props){

  const { ordem, index, mudarOrdem, reordenar } = props
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: { index, type: ItemTypes.REORDENAR },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ handlerId }, drop] = useDrop({
    accept: [ItemTypes.REORDENAR],
    drop: () => ({ tipo: ordem.tipo, index}),
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      reordenar(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
  });

  drag(drop(ref))
  return (
    <>
      <li ref={ref} style={{opacity: isDragging ? 0 : 1, position: 'relative'}} data-handler-id={handlerId}>
        <Checkbox
          checked={ordem.selecao}
          onChange={() => mudarOrdem(ordem)}
        >
          {getMessage(`sequenciamento.ordem.${ordem.tipo}.label`)}
          {ordem.selecao
            && renderSeta(ordem.selecao === 'asc' ? <MdKeyboardArrowUp {...setaProps}/> : <MdKeyboardArrowDown {...setaProps}/>, ordem.selecao)}
        </Checkbox>
        <GrDrag style={{position: 'absolute', right: 0, top: 3, cursor: 'grab'}}/>
      </li>
      <Divider style={{margin: '2px 0'}}/>
    </>
  )

  function renderSeta(prop, mensagem){
    return (
      <Tooltip title={getMessage(`sequenciamento.ordem.${mensagem}.label`)}>
        {prop}
      </Tooltip>
    )
  }

}

export default OrdenarSelect
