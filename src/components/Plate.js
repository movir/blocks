import React, { Component } from 'react';
import styled from 'styled-components';
import DragDropPlace from './drag-n-drop';
import { DropTarget } from 'react-dnd';

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
            blockIds: ['b1', 'b2', 'b3'],
            blocks: {
                b1: { id: 'b1', top: 30, left: 30, width: 50, height: 50 },
                b2: { id: 'b2', top: 150, left: 460, width: 50, height: 50 },
                b3: { id: 'b3', top: 200, left: 150, width: 50, height: 50 },
            },
            linkIds: [],
            links: {},
            linking: null,
        };

        this.linking = null;

        this.linkIt = this.linkIt.bind(this);
        this.startLinking = this.startLinking.bind(this);
        this.endLinking = this.endLinking.bind(this);
        this.updateBlockPosition = this.updateBlockPosition.bind(this);
        this.rmLinks = this.rmLinks.bind(this);
        this.clearLinking = this.clearLinking.bind(this);
        this.rmBlock = this.rmBlock.bind(this);
    }
    linkIt(blockId) {
        if (this.linking === null) {
            this.startLinking(blockId);
        } else {
            this.endLinking(blockId);
        }
    }
    clearLinking(event) {
        if (!event || event.keyCode === 27) {
            this.linking = null;
            document.removeEventListener('keydown', this.clearLinking, false);
        }
    }
    startLinking(blockId) {
        document.addEventListener('keydown', this.clearLinking, false);
        this.linking = {
            start: { id: blockId },
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
            endId,
        });
        this.clearLinking();
    }
    render() {
        const { blockIds, blocks, linkIds, links } = this.state;
        return (
            <DragDropPlace>
                <PlateArea>
                    {blockIds.map(blockId => (
                        <BlockItem
                            key={blockId}
                            blockItem={blocks[blockId]}
                            blockId={blockId}
                            linkIt={this.linkIt}
                            rmBlock={this.rmBlock}
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
