import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

import { LinkIdType, LinkItemType, BlockItemType } from './Types';
import { getCenter, calcLine } from './utils';

const configContainer = () => document.getElementById('config-pop-up');

const DelButton = styled('div')`
    width: 10px;
    margin: 0 auto;
    position: relative;
    top: -0.5em;
    cursor: pointer;
`;
const LinkConfig = styled('div')`
    width: 10px;
    position: absolute;
    cursor: pointer;
    transform-origin: center;
    left: 50%;
    margin-left: -0.5em;
    ${({ bottom }) =>
        bottom
            ? `
        top: 0.2em;
        transform: rotate(0deg);
    `
            : `
        top: -2em;
        margin-left 0;
        transform: rotate(180deg);
    `};
`;

const RegularLinkItem = styled('div')`
    position: absolute;
    height: 1px;
    transform-origin: 0 50%;
    background: ${({ color }) => color || 'black'};
    z-index: 5;
`;

const NewBornLinkItem = RegularLinkItem.extend`
    animation: growing 0.5s ease-out;

    & ${LinkConfig} {
        animation: appear 0s step-end 0.5s;
        animation-fill-mode: both;
    }

    @keyframes growing {
        0% {
            width: 0;
        }
        100% {
            width: ${({ width }) => width}px;
        }
    }

    @keyframes appear {
        0% {
            visibility: collapse;
        }
        100% {
            visibility: visible;
        }
    }
`;

const borderColor = 'darkgrey';
const bgcolor = 'whitesmoke';
const ConfigPopUpWrapper = styled('div')`
    max-width: 200px;
    position: relative;
    background: ${bgcolor};
    z-index: 15;
    padding: 0 15px;
    border-radius: 0.25em;
    border: 1px solid ${borderColor};
    box-shadow: 1px 0 5px 0 ${borderColor};
    margin-top: 1em;
    margin-left: 0.5em;
    transform: translateY(-50%);

    &:after, &:before {
        right: 100%;
        top: 50%;
        border: solid transparent;
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    
    &:after {
        border-color: rgba(0, 0, 0, 0);
        border-right-color: ${bgcolor};
        border-width: 8px;
        margin-top: -8px;
    }
    &:before {
        border-color: rgba(0, 0, 0, 0);
        border-right-color: ${borderColor};
        border-width: 9px;
        margin-top: -9px;
    }
`;

const ConfigPopUp = ({ linkId, position, startId, endId, color, changeColor, closeIt, removeLink }) => {
    return (
        <div style={{ position: 'absolute', ...position }}>
            <ConfigPopUpWrapper>
                <p>
                    link: {startId} &ndash;> {endId}
                </p>
                <hr />
                <p>
                    <label htmlFor="link-color-chooser">Line Color:</label>
                    <select name="link-color" id="link-color-chooser" value={color} onChange={changeColor}>
                        <option value="black">black</option>
                        <option value="blue">blue</option>
                        <option value="green">green</option>
                        <option value="orange">orange</option>
                        <option value="purple">purple</option>
                        <option value="red">red</option>
                    </select>
                </p>
                <p>
                    <button onClick={removeLink}>Remove Link</button>
                    &nbsp;
                    <button onClick={closeIt}>Close</button>
                </p>
            </ConfigPopUpWrapper>
        </div>
    );
};
const LINE_COLOR = 'black';
class Link extends PureComponent {
    constructor(props) {
        super(props);
        this.removeLink = this.removeLink.bind(this);
        this.showConfig = this.showConfig.bind(this);
        this.hideConfig = this.hideConfig.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.newBorned = true;

        this.state = {
            showConfig: false,
            lineColor: LINE_COLOR,
        };
    }

    showConfig() {
        this.setState({ showConfig: true });
    }
    hideConfig() {
        this.setState({ showConfig: false });
    }
    changeColor(e) {
        const lineColor = e.target.value || LINE_COLOR;
        this.setState({ lineColor });
    }

    componentDidMount() {
        this.newBorned = false;
    }

    removeLink() {
        this.props.rmLinks(this.props.linkId);
    }

    render() {
        const { start, end, linkId, linkItem } = this.props;

        const line = calcLine(getCenter(start), getCenter(end));

        const lineParams = {
            top: line.y1,
            left: line.x1,
            width: line.width,
            rotate: line.angle,
        };
        const LinkItem = this.newBorned ? NewBornLinkItem : RegularLinkItem;
        const rightSide = lineParams.rotate > -Math.PI / 2 && lineParams.rotate < Math.PI / 2;
        return (
            <Fragment>
                <LinkItem
                    id={linkId}
                    style={{
                        top: `${lineParams.top || 0}px`,
                        left: `${lineParams.left || 0}px`,
                        width: `${lineParams.width || 0}px`,
                        transform: `rotate(${lineParams.rotate || 0}rad)`,
                    }}
                    width={lineParams.width}
                    color={this.state.lineColor}
                >
                    <LinkConfig onClick={this.showConfig} bottom={rightSide}>
                        <span role="img" aria-label="configuration">
                            🔧
                        </span>
                    </LinkConfig>
                </LinkItem>
                {this.state.showConfig &&
                    ReactDOM.createPortal(
                        <ConfigPopUp
                            linkId={linkId}
                            startId={start.id}
                            endId={end.id}
                            position={this.configPopUpPosition(line)}
                            closeIt={this.hideConfig}
                            changeColor={this.changeColor}
                            data={linkItem}
                            removeLink={this.removeLink}
                        />,
                        configContainer()
                    )}
            </Fragment>
        );
    }
    configPopUpPosition({ x1, x2, y1, y2 }) {
        return {
            left: x1 + (x2 - x1) / 2,
            top: y1 + (y2 - y1) / 2,
        };
    }
}

Link.propTypes = {
    linkId: LinkIdType, // link id
    linkItem: LinkItemType, //link data object
    start: BlockItemType, //start block data
    end: BlockItemType, // end block data

    rmLinks: PropTypes.func,
};

export default Link;
