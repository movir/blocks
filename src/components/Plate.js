import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DragDropPlace from './drag-n-drop';
import { DragSource, DropTarget } from 'react-dnd';

import BlockItem from './Block';
import LinkItem from './Link';

import { BLOCK_TYPE } from './constants';

const PlateArea = styled('div')`
    width: 80%;
    height: 500px;
    position: relative;
    border: 1px solid;
    margin: 15px auto;
`;

class Plate extends Component {
    constructor() {
        super();
        this.state = {
            blockIds: ['block1', 'block2'],
            blocks: {
                block1: { id: 'block1', top: 30, left: 30, width: 40, height: 35 },
                block2: { id: 'block2', top: 150, left: 460, width: 40, height: 35 }
            },
            linkIds: [],
            links: {},
            linking: null
        };

        this.linking = null;

        this.linkIt = this.linkIt.bind(this);
        this.startLinking = this.startLinking.bind(this);
        this.endLinking = this.endLinking.bind(this);
        this.updateBlockPosition = this.updateBlockPosition.bind(this);
        this.rmLink = this.rmLink.bind(this);
    }
    linkIt(blockId) {
        return () => {
            if (this.linking === null) {
                this.startLinking(blockId);
            } else {
                this.endLinking(blockId);
            }
        };
    }
    clearLinking(event) {
        event && event.keyCode === 27 && console.log('\t', 'clear by Esc');

        if (!event || event.keyCode === 27) {
            this.linking = null;
            document.removeEventListener('keydown', this.clearLinking, false);
        }
    }
    startLinking(blockId) {
        document.addEventListener('keydown', this.clearLinking, false);
        this.linking = {
            start: { id: blockId }
        };
    }
    endLinking(blockId) {
        this.linking['end'] = { id: blockId };

        const { start: { id: startId }, end: { id: endId } } = this.linking;
        const { linkIds } = this.state;

        //prevent self Linking
        if (endId === startId) return this.clearLinking();

        //prevent duplicating
        if (linkIds.find(linkId => linkId === `${startId}-${endId}`)) return this.clearLinking();

        this.addLink({
            id: `${startId}-${endId}`,
            startId,
            endId
        });
        this.clearLinking();
    }
    render() {
        const { blockIds, blocks, linkIds, links } = this.state;
        return (
            <DragDropPlace>
                <PlateArea>
                    {blockIds.map(blockId => (
                        <BlockItem {...blocks[blockId]} key={blockId} onClick={this.linkIt(blockId)} />
                    ))}
                    {linkIds.map(linkId => (
                        <LinkItem
                            key={linkId}
                            linkItem={links[linkId]}
                            start={blocks[links[linkId].startId]}
                            end={blocks[links[linkId].endId]}
                            rmLink={this.rmLink}
                        />
                    ))}
                    <ConnectedDropField updateBlockPosition={this.updateBlockPosition} />
                </PlateArea>
            </DragDropPlace>
        );
    }
    updateBlockPosition(id, positionParams) {
        const blocks = this.state.blocks;
        const block = { ...blocks[id], ...positionParams };

        this.setState({ blocks: { ...blocks, [id]: block } });
    }
    addLink(newLink) {
        this.setState({
            linkIds: [...this.state.linkIds, newLink.id],
            links: { ...this.state.links, [newLink.id]: newLink }
        });
    }
    rmLink(linkId) {
        const links = { ...this.state.links };
        delete links[linkId];

        this.setState({
            linkIds: this.state.linkIds.filter(_linkId => _linkId !== linkId),
            links
        });
    }
}

const plateTarget = {
    hover(props, monitor, component) {
        const draggedItem = monitor.getItem();
        const { x: dX = 0, y: dY = 0 } = monitor.getDifferenceFromInitialOffset() || {};
        props.updateBlockPosition(draggedItem.id, {
            top: draggedItem.top + dY,
            left: draggedItem.left + dX
        });
    },
    drop(props, monitor, component) {
        const draggedItem = monitor.getItem();
        const { x: dX = 0, y: dY = 0 } = monitor.getDifferenceFromInitialOffset() || {};
        props.updateBlockPosition(draggedItem.id, {
            top: draggedItem.top + dY,
            left: draggedItem.left + dX
        });
    }
};
export default Plate;

const DropField = ({ connectDropTarget, ...props }) =>
    connectDropTarget(
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }}
        />
    );
const ConnectedDropField = DropTarget(BLOCK_TYPE, plateTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
}))(DropField);
