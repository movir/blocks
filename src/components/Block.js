import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';

import { BLOCK_TYPE } from './constants';

const DelBtn = styled('span')`
    position: absolute;
    border: 1px solid;
    background: white;
    font-size: 9px;
    line-height: 10px;
    border-radius: 50%;
    display: none;
`;
const BlockItem = styled('div')`
    position: absolute;
    cursor: pointer;
    z-index: 10;
    border-radius: 50%;
    border: 1px solid;
    background: white;

    &:hover {
        & ${DelBtn} {
            display: block;
        }
    }
`;

class Block extends PureComponent {
    constructor(props) {
        super(props);
        this.deleteBlock = this.deleteBlock.bind(this);
    }
    deleteBlock () {
        this.props.rmBlock(this.props.id);
    }

    calcDeletePosition() {
        const r = this.props.width / 2;
        const width = 10;
        let delta;
        delta = r * (1 - Math.cos(Math.PI / 4));
        delta = delta - width / 2;
        return {
            width,
            height: width,
            top: delta,
            right: delta,
        };
    }
    render() {
        const { connectDragSource, isDragging, ...props } = this.props;
        return (
            <BlockItem
                style={{
                    width: `${props.width || 50}px`,
                    height: `${props.height || 50}px`,
                    top: `${props.top || 0}px`,
                    left: `${props.left || 0}px`,
                }}
                onClick={props.onClick}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // border: '1px solid',
                        // background: 'white',
                        // borderRadius: '50%',
                    }}
                >
                    {connectDragSource(<span style={{ cursor: 'move' }}>☰</span>)}
                </div>
                <DelBtn style={this.calcDeletePosition()} onClick={this.deleteBlock}>
                    x
                </DelBtn>
            </BlockItem>
        );
    }
}

Block.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
};

const blockSource = {
    beginDrag(props, monitor, component) {
        const { id, top, left } = props;
        return {
            id,
            top,
            left,
        };
    },
};

export default DragSource(BLOCK_TYPE, blockSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(Block);
