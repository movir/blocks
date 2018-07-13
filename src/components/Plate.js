import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import DragDropPlace from './drag-n-drop';
import { DropTarget } from 'react-dnd';

import { blockIdGen } from './utils';
import BlockItem from './Block';
import LinkItem from './Link';

import { BLOCK_TYPE } from './constants';

import { sampleBlocks } from './sampleData';

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
            blockIds: [],
            blocks: {},
            linkIds: [],
            links: {},
            linking: null,
        };
        //apply sample blocks
        Object.assign(this.state, sampleBlocks);

        this.linking = null;

        this.linkIt = this.linkIt.bind(this);
        this.startLinking = this.startLinking.bind(this);
        this.endLinking = this.endLinking.bind(this);
        this.updateBlockPosition = this.updateBlockPosition.bind(this);
        this.rmLinks = this.rmLinks.bind(this);
        this.clearLinking = this.clearLinking.bind(this);
        this.rmBlock = this.rmBlock.bind(this);
        this.addBlock = this.addBlock.bind(this);
    }
    linkIt(blockId) {
        if (this.state.linking === null) {
            this.startLinking(blockId);
        } else {
            this.endLinking(blockId);
        }
    }
    clearLinking(event) {
        if (!event || event.keyCode === 27 || event.type === 'click') {
            this.setState({ linking: null });
            document.removeEventListener('keydown', this.clearLinking, false);
            document.removeEventListener('click', this.clearLinking, false);
        }
    }
    startLinking(blockId) {
        document.addEventListener('keydown', this.clearLinking, false);
        document.addEventListener('click', this.clearLinking, false);
        this.setState({
            linking: {
                start: { id: blockId },
            },
        });
    }
    endLinking(blockId) {
        const { linking } = this.state;
        linking['end'] = { id: blockId };

        const { start: { id: startId }, end: { id: endId } } = linking;
        const { linkIds } = this.state;

        //prevent self Linking
        if (endId === startId) return this.clearLinking();

        //prevent duplicating
        if (linkIds.find(linkId => linkId === `${startId}-${endId}`)) return this.clearLinking();

        this.addLink(startId, endId);
        this.clearLinking();
    }
    render() {
        const { blockIds, blocks, linkIds, links, linking } = this.state;
        return (
            <Fragment>
                <DragDropPlace>
                    <PlateArea>
                        {blockIds.map(blockId => (
                            <BlockItem
                                key={blockId}
                                blockItem={blocks[blockId]}
                                blockId={blockId}
                                linkIt={this.linkIt}
                                rmBlock={this.rmBlock}
                                addBlock={this.addBlock}
                                linking={!!linking}
                            />
                        ))}
                        {linkIds.map(linkId => (
                            <LinkItem
                                key={linkId}
                                linkId={linkId}
                                linkItem={links[linkId]}
                                start={blocks[links[linkId].startId]}
                                end={blocks[links[linkId].endId]}
                                rmLinks={this.rmLinks}
                            />
                        ))}
                        <ConnectedDropField updateBlockPosition={this.updateBlockPosition} />
                        <div id={"config-pop-up"} />
                    </PlateArea>
                </DragDropPlace>
            </Fragment>
        );
    }
    updateBlockPosition(id, positionParams) {
        const blocks = this.state.blocks;
        const block = { ...blocks[id], ...positionParams };

        this.setState({ blocks: { ...blocks, [id]: block } });
    }
    addLink(startId, endId) {
        const newLink = {
            id: `${startId}-${endId}`,
            startId,
            endId,
        };
        this.setState({
            linkIds: [...this.state.linkIds, newLink.id],
            links: { ...this.state.links, [newLink.id]: newLink },
        });
    }
    rmLinks(ids) {
        ids = [].concat(ids);
        const { linkIds: _linkIds, links: _links } = this.state;

        const linkIds = _linkIds.filter(linkId => !ids.includes(linkId));
        const links = linkIds.reduce((links, linkId) => Object.assign(links, { [linkId]: _links[linkId] }), {});

        this.setState({ linkIds, links });
    }
    rmBlock(blockId) {
        const { blocks: _blocks, blockIds: _blockIds, links: _links, linkIds: _linkIds } = this.state;

        const blockIds = _blockIds.filter(_blockId => _blockId !== blockId);
        const blocks = blockIds.reduce((blocks, blockId) => Object.assign(blocks, { [blockId]: _blocks[blockId] }), {});

        const LinksToBeDelted = _linkIds.filter(
            linkId => _links[linkId].startId === blockId || _links[linkId].endId === blockId
        );
        this.rmLinks(LinksToBeDelted);

        this.setState({ blockIds, blocks });
    }
    addBlock(newBlockItem, parentBlock) {
        const newBlock = { ...newBlockItem, id: blockIdGen(), parentBlock };

        this.setState({
            blockIds: [...this.state.blockIds, newBlock.id],
            blocks: { ...this.state.blocks, [newBlock.id]: newBlock },
        });
        if (parentBlock) {
            this.addLink(parentBlock.id, newBlock.id);
        }
    }
}

const plateTarget = {
    hover(props, monitor) {
        const draggedItem = monitor.getItem();
        const { x: dX = 0, y: dY = 0 } = monitor.getDifferenceFromInitialOffset() || {};
        props.updateBlockPosition(draggedItem.id, {
            top: draggedItem.top + dY,
            left: draggedItem.left + dX,
        });
    },
    drop(props, monitor) {
        const draggedItem = monitor.getItem();
        const { x: dX = 0, y: dY = 0 } = monitor.getDifferenceFromInitialOffset() || {};
        props.updateBlockPosition(draggedItem.id, {
            top: draggedItem.top + dY,
            left: draggedItem.left + dX,
        });
    },
};
export default Plate;

const DropField = ({ connectDropTarget }) =>
    connectDropTarget(
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            }}
        />
    );
const ConnectedDropField = DropTarget(BLOCK_TYPE, plateTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver(),
}))(DropField);
