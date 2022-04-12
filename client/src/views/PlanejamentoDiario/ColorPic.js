import React, {Component} from 'react';
import {BlockPicker, SketchPicker} from 'react-color';
import {CgColorPicker} from "react-icons/all";
import PropTypes from "prop-types";

class ColorPic extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange('color', color.hex);
  }


  renderModal = () => {
    const popover = {
      position: 'absolute',
      zIndex: '2',
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }

    const { color } = this.props.currentState;
    return (
      <div
        onClick={this.stopPropagation}
      >
        <div style={ popover }>
          <SketchPicker color={color} onChangeComplete={this.onChange} />
        </div>
      </div>
    );
  };

  render() {
    const { expanded, onExpandEvent } = this.props;
    return (
      <div
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
      >
        <div
          className={"rdw-option-wrapper"}
          onClick={onExpandEvent}
        >
          <CgColorPicker />
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}

export default ColorPic;
