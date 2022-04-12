import React from "react";

export default class Droppable extends React.Component{

  drop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('transfer');
    console.log(JSON.parse(data))
    e.target.appendChild(document.getElementById(data.id));
  }

  allowDrop = (e) => {
    e.preventDefault();
  }

  render(){
    return(<div id={this.props.id} onDrop={this.drop} onDragOver={this.allowDrop} style={this.props.style} >
      {this.props.children}
    </div>)
  }
}

