import React, {Component} from 'react';
import styled from "styled-components";

const BlockItem = styled("div")`
  border: 1px solid;
  position: absolute;
  width: ${({ width }) => width || "30px"};
  height: ${({ height }) => height || "30px"};
  top: ${({ top }) => top || 0};
  left: ${({ left }) => left || 0};
  background: white;
  cursor: pointer;
  z-index: 10;
`;


class Block extends Component {
    render() {
        return (
            <BlockItem  {...this.props}/>
        );
    }
}
Block.propTypes = {};

export default Block;
