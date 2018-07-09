import React, {Component} from 'react';
import styled from "styled-components";

const LinkItem = styled("div")`
  position: absolute;
  height: 1px;
  transform-origin: 0;
  background: black;
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  width: ${({ width }) => width || 0}px;
  transform: rotate(${({ rotate }) => rotate || 0}rad);
  z-index: 5;
`;


class Link extends Component {
    render() {
        return (
            <LinkItem {...this.props}/>
        );
    }
}
Link.propTypes = {};

export default Link;
