import React from "react";
import { FlowChart } from "@mrblenny/react-flow-chart";
import * as actions  from "@mrblenny/react-flow-chart/src/container/actions";
import mapValues from "@mrblenny/react-flow-chart/src/container/utils/mapValues";
import * as actionCanvasDrop from "./actions";

export default class FluxoDeProcessos extends React.Component {
  state = {
  }

  stateActions = mapValues(actions, (func) =>
      (...args) => this.setState(func(...args)))

  constructor (props) {
    super(props)
    this.state = props.chart
  }

  update(){
    this.setState(this.state) // renderiza novamente
  }

  stateAux = mapValues(actionCanvasDrop, (func) => (...args) => this.setState(func(...args)))

  render(){
    const { Components, config } = this.props

    this.stateActions.onCanvasDrop = this.stateAux.onCanvasDrop
    this.stateActions.onNodeClick = this.stateAux.onNodeClick
    this.stateActions.onDeleteKey = this.stateAux.onDeleteKey
    this.stateActions.onDragNode = this.stateAux.onDragNode
    this.stateActions.onLinkComplete = this.stateAux.onLinkComplete
    this.stateActions.onNodeDoubleClick = this.stateAux.onNodeDoubleClick
    this.stateActions.onLinkClick = this.stateAux.onLinkClick
    this.stateActions.onCanvasClick = this.stateAux.onCanvasClick

    return (
      <FlowChart
        chart={this.state}
        callbacks={this.stateActions}
        Components={Components}
        config={config}
      />
    )
  }
}
