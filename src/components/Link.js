import React, { PureComponent } from 'react';
import styled from 'styled-components';

const LinkItem = styled('div')`
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

const DelButton = styled('div')`
    width: 10px;
    margin: 0 auto;
    position: relative;
    top: -0.5em;
    cursor: pointer;
`;

class Link extends PureComponent {
    constructor(props) {
        super(props);
        this.removeLink = this.removeLink.bind(this);
    }

    removeLink(linkId) {
        return () => this.props.rmLink(linkId);
    }
    render() {
        const { start, end, linkItem } = this.props;

        const line = this.calcLine(this.getCenter(start), this.getCenter(end));

        const lineParams = {
            top: line.y1,
            left: line.x1,
            width: line.width,
            rotate: line.angle
        };

        return (
            <LinkItem
                id={linkItem.id}
                style={{
                    top: `${lineParams.top || 0}px`,
                    left: `${lineParams.left || 0}px`,
                    width: `${lineParams.width || 0}px`,
                    transform: `rotate(${lineParams.rotate || 0}rad)`,
                }}
            >
                <DelButton onClick={this.removeLink(linkItem.id)}>X</DelButton>
            </LinkItem>
        );
    }
    getCenter = ({ top, left, width, height }) => [+left + width / 2, +top + height / 2];

    calcLine = ([x1, y1], [x2, y2]) => {
        const x = Math.abs(x2 - x1);
        const y = Math.abs(y2 - y1);
        const width = Math.sqrt(x ** 2 + y ** 2);
        let angle = Math.acos(x / width);
        if (y2 < y1) {
            angle = -angle;
        }

        if (x2 < x1) {
            angle = Math.PI - angle;
        }

        return {
            x1,
            y1,
            x2,
            y2,
            width,
            angle
        };
    };
}
Link.propTypes = {};

export default Link;
