import Loader from "react-loader-spinner";
import React, { Component } from "react";
import "./Loading.css";

let context;

export default class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderIsOpen: false,
      loaderRequestLists: [],
      currentLoaderRequestIndex: 0
    };
    context = this;
  }

  openLoader = () => {
    let state = this.state;
    state.loaderRequestLists.push(state.currentLoaderRequestIndex);
    state.currentLoaderRequestIndex++;
    if (state.loaderIsOpen === false) {
      state.loaderIsOpen = true;
    }
    this.setState(state);
  };

  closeLoader = () => {
    let state = this.state;
    state.loaderRequestLists.pop(state.currentLoaderRequestIndex);
    state.currentLoaderRequestIndex--;
    if (state.loaderIsOpen === true && state.loaderRequestLists.length === 0) {
      state.loaderIsOpen = false;
    }
    this.setState(state);
  };

  render() {
    return (
      <div>
        {this.state.loaderIsOpen && (
          <div className="Loading">
            <div className="loader">
              <Loader
                type={"TailSpin"}
                color={"#B83D3D"}
                width={60}
                height={60}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export let openLoader = (silent = false) => {
  if (silent === false) {
    context.openLoader();
  }
};

export let closeLoader = (silent = false) => {
  if (silent === false) {
    context.closeLoader();
  }
};
