import React, {Component} from 'react';
import styled from 'styled-components';

const PlateArea = styled('div')`
    width: 80%;
    height: 500px;
    position: relative;
    border: 1px solid;
    margin: 15px auto;
`;
const BlockItem = styled('div')`
    border: 1px solid;
    position: absolute;
    width: ${({width})=>width||'30px'};
    height: ${({height})=>height||'30px'};
    top: ${({top})=>top||0};
    left: ${({left})=>left||0};
    background: white;
    cursor: pointer;
    z-index: 10;
`;
const LinkItem = styled('div')`
    position: absolute;
    height: 1px;
    transform-origin: 0;
    background: black;
    top: ${({top})=>top||0}px;
    left: ${({left})=>left||0}px;
    width: ${({width})=>width||0}px;
    transform: rotate(${({rotate})=>rotate||0}rad);
    z-index: 5;
`;

class Plate extends Component {
    constructor(){
        super();
        this.state = {
            blocks:[
                {id: 'block1', top: '10%', left: '10%'},
                {id: 'block2', top: '20%', left: '30%'}
            ],
            links: [],
            linking: null
        };

        this.linking = null;

        this.linkIt = this.linkIt.bind(this);
        this.startLinking = this.startLinking.bind(this);
        this.endLinking = this.endLinking.bind(this);
    }
    linkIt(block){
        return (e) => {
            console.log({block}); // IgrEd
            const {offsetHeight, offsetWidth, offsetTop, offsetLeft} = e.target;

            if (this.linking ===  null){
                this.startLinking(block, {offsetHeight, offsetWidth, offsetTop, offsetLeft});
            } else {
                this.endLinking(block, {offsetHeight, offsetWidth, offsetTop, offsetLeft})
            }
        }
    }
    clearLinking(event){
        console.log('Clear Linking'); // IgrEd
        (event && event.keyCode === 27) && console.log('\t', 'clear by Esc'); // IgrEd

        if(!event || event.keyCode === 27) {
            this.linking = null;
            document.removeEventListener("keydown", this.clearLinking, false);
        }
    }
    startLinking(block, offset){
        console.log('start linking'); // IgrEd
        document.addEventListener("keydown", this.clearLinking, false);
        this.linking = {
            start: {id: block.id, ...offset}
        }
    }
    endLinking(block, offset){
        console.log('end linking'); // IgrEd
        //ToDo prevent self Linking
        this.linking['end'] = {id: block.id, ...offset};

        const {start, end} = this.linking;
        const {links} = this.state;

        const getCenter = (offsets) => [
            offsets.offsetLeft + offsets.offsetWidth/2,
            offsets.offsetTop + offsets.offsetHeight/2
        ];

        const line = this.calcLine(getCenter(start), getCenter(end));
        const newLink =  {
            id: `${start.id}-${end.id}`,
            top: line.y1,
            left: line.x1,
            width: line.width,
            rotate: line.angle
        };

        this.setState({links: [...links, newLink]});
        this.clearLinking();
    }
    calcLine([x1, y1], [x2, y2]){
        const x = Math.abs(x2 - x1);
        const y = Math.abs(y2 - y1);
        const width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        let  angle = Math.acos(x/width);
        if (y2 < y1) {
            angle = - angle;
        }

        if (x2 < x1 ) {
            angle = Math.PI - angle;
        }
        return {
            x1, y1, x2, y2, width, angle
        }
    }
    render() {
        return (
            <PlateArea>
                {this.state.blocks.map(block => (
                    <BlockItem {...block} key={block.id} onClick={this.linkIt(block)} />
                ))}
                {this.state.links.map(link => (
                    <LinkItem key={link.id} {...link} />
                ))}

            </PlateArea>
        );
    }
}

export default Plate;
