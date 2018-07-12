import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';

import { BLOCK_TYPE } from './constants';
import { BlockIdType, BlockItemType } from './Types';

const DelBtn = styled('span')`
    position: absolute;
    border: 1px solid;
    background: white;
    font-size: 9px;
    line-height: 10px;
    border-radius: 50%;
    display: none;
`;
const RegularBlockItem = styled('div')`
    position: absolute;
    cursor: pointer;
    z-index: 10;
    border-radius: 50%;
    border: 1px solid;
    background: white;
    transform-origin: center;

    &:hover {
        & ${DelBtn} {
            display: block;
        }
    }
`;

const newBornBlockItem = RegularBlockItem.extend`
    animation: birth 0.5s ease-out;

    @keyframes birth {
        0% {
            top: ${({ blockItem: { parentBlock = {}, top } }) => parentBlock.top || top}px;
            left: ${({ blockItem: { parentBlock = {}, left } }) => parentBlock.left || left}px;
            transform: scale(0.1);
        }
        100% {
            top: ${({ blockItem: { top } }) => top}px;
            left: ${({ blockItem: { left } }) => left}px;
            transform: none;
        }
    }
`;

class Block extends PureComponent {
    constructor(props) {
        super(props);
        this.deleteBlock = this.deleteBlock.bind(this);
        this.blockLink = this.blockLink.bind(this);
        this.createNewBlock = this.createNewBlock.bind(this);

        this.newBorned = true;
    }
    deleteBlock(e) {
        e.stopPropagation();
        this.props.rmBlock(this.props.blockId);
    }
    blockLink() {
        this.props.linkIt(this.props.blockId);
    }
    componentDidMount() {
        this.newBorned = false;
    }
    createNewBlock() {
        const { top, left, width, height } = this.props.blockItem;
        const currentPosition = { top, left, width, height };
        const newBlockItem = {
            ...currentPosition,
            top: top + 1.5 * height,
            left: left + 1.5 * width,
        };
        this.props.addBlock(newBlockItem, this.props.blockItem);
    }
    calcDeleteBtnPosition() {
        const r = this.props.blockItem.width / 2;
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
        const { connectDragSource, blockItem } = this.props;
        const BlockItem = this.newBorned ? newBornBlockItem : RegularBlockItem;
        return (
            <BlockItem
                style={{
                    width: `${blockItem.width || 50}px`,
                    height: `${blockItem.height || 50}px`,
                    top: `${blockItem.top || 0}px`,
                    left: `${blockItem.left || 0}px`,
                }}
                blockItem={blockItem}
                onClick={this.blockLink}
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
                    }}
                >
                    {connectDragSource(
                        <span style={{ cursor: 'pointer' }} onClick={this.createNewBlock}>
                            {`➕`}{/*☰*/}
                        </span>
                    )}
                </div>
                <DelBtn style={this.calcDeleteBtnPosition()} onClick={this.deleteBlock}>
                    x
                </DelBtn>
            </BlockItem>
        );
    }
}

Block.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,

    blockId: BlockIdType,
    blockItem: BlockItemType,
    linkIt: PropTypes.func,
    rmBlock: PropTypes.func,
    addBlock: PropTypes.func,
};

const blockSource = {
    beginDrag(props) {
        const { id, top, left } = props.blockItem;
        return { id, top, left };
    },
};

export default DragSource(BLOCK_TYPE, blockSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(Block);
