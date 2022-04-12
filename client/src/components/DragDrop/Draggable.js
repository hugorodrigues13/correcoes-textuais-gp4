import React from "react";
import { REACT_FLOW_CHART } from "@mrblenny/react-flow-chart";

export default class Draggable extends React.Component{

  render(){

    return(
      <div
        id={this.props.id}
        value={this.props.value}
        draggable="true"
        onDragStart={this.drag}
        onDragOver={this.noAllowDrop}
        style={this.props.style} >
      {this.props.children}
    </div>)
  }

  drag = (e) => {
    e.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({
      id: this.props.id,
      type: this.props.type,
      ports: this.props.ports,
      properties: this.props.properties
    }));
  }

  noAllowDrop = (e) => {
    e.stopPropagation();
  }
}
