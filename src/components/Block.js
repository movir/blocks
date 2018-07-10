import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragSource, DropTarget } from "react-dnd";

import { BLOCK_TYPE } from "./constants";

const BlockItem = styled("div")`
  position: absolute;
  width: ${({ width }) => width || 30}px;
  height: ${({ height }) => height || 30}px;
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  cursor: pointer;
  z-index: 10;
`;

class Block extends Component {
  render() {
    const { connectDragSource, isDragging, ...props } = this.props;
    return (
      <BlockItem {...props}>
        {connectDragSource(
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              background: "white"
            }}
          >
            <span style={{ cursor: "move" }}>X</span>
          </div>
        )}
      </BlockItem>
    );
  }
}

Block.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

const blockSource = {
  beginDrag(props, monitor, component) {
    const { id, top, left } = props;
    return {
      id,
      top,
      left
    };
  }
};

export default DragSource(BLOCK_TYPE, blockSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Block);
