# Madera
## Functional Reactive Micro Framework
Madera is a front-end framework that lets you write pure business-logic
functions, plain React Components, and promise-based HTTP requests, and wire
them up using reactive primitives.

## Simple example
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Madera,
    explode, asActionType,
    connectComponent, rootComponent
} from 'madera';


function counterReducers(action$){
    let { init$, inc$, dec$ } = explode(action$);

    return [
        init$, state => state.set('count', 0),
        inc$, state => state.update('count', c => ++c),
        dec$, state => state.update('count', c => --c)
    ]
}

class Counter extends React.Component{
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

const connectedCounter = connectComponent(
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


const { action$, state$, init } = Madera(
    [counterReducers], // List of reducers
    ['INIT', 'INC', 'DEC'] // List of action types
);

const Root = rootComponent(action$, state$, init)(connectedCounter);
ReactDOM.render(<Root/>, document.getElementById('app'));
```
