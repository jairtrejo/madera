import React from 'react';
import { connectComponent, asActionType } from 'madera';


export class Counter extends React.Component{
    render(){
        return (
            <div>
                <p>{ this.props.count }</p>
                <button id="inc-btn" onClick={ this.props.inc }>+</button>
                <button id="dec-btn" onClick={ this.props.dec }>-</button>
            </div>
        )
    }
}


export default connectComponent(
    state$ => ({
        count: state$.map('.get', 'count')
    }),
    () => ({
        // Verbosely
        inc: event$ => asActionType('INC')(event$),
        // Or more succintly
        dec: asActionType('DEC')
    })
)(Counter);
