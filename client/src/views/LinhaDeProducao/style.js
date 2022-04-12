import styled from "styled-components";

import {CloseCircleOutlined} from '@ant-design/icons';

export const Outer = styled.div`
  padding: 6px;
  border-radius: 5px;
`

export const Item = styled.div`
  padding: 8px;
  color: #555;
  background-color: white;
  border-radius:3px;
`

export const CanvasOuterCustom = styled.div`
  position: relative;
  background-size: 10px 10px;
  background-color: #fff;
  background-image:
    linear-gradient(90deg,hsla(0,0%,0%,.1) 1px,transparent 0),
    linear-gradient(180deg,hsla(0,0%,0%,.1) 1px,transparent 0);
  width: 100%;
  overflow: hidden;
`

export const PortOuter = styled.div`
  width: 12px;
  height: 12px;
  background: rgba(210,210,210,0.55);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PortDefaultOuter = styled.div`
  width: 14px;
  height: 13px;
  background: rgba(200,200,200,1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PageContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  max-width: 100vw;
  max-height: 100%;
  border: 1px solid;
  border-color: ${(props) => props.requiredLinkColor};
`

export const droppableStyle = {
  background: '#FFF',
  width: '100%',
  height: '80px',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  cursor: 'move',
  padding: '8px',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
}

