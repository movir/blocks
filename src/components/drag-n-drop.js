import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class DragDropPlace extends React.Component {
    render() {
        return (<div>
            {this.props.children}
        </div>);
    }
}
export default DragDropContext(HTML5Backend)(DragDropPlace);