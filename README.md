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

## Installing
You can install via npm:

```
npm install madera
```

And then use it as a module:

```
madera = require('madera');
// Or, if using ES6
import { Madera } from 'madera';
```

## Documentation
The framework is still on a very early stage, but you can
[check out the examples](https://github.com/jairtrejo/madera/tree/master/examples).

## Influences
I affectionately call Madera the franken-framework, as it is a patchwork of all
the things I like best from diverse front-end frameworks.

It all started by looking at [Niklas von Hertzen's Bacon + React
integration](https://github.com/niklasvh/react-bacon-flux-poc). It models
traditional flux stores as [BaconJS](https://baconjs.github.io/) properties,
and the dispatcher as an event stream. This lets you write coordination between
components using FRP primitives, which is where they shine. He also uses
[ImmutableJS](https://facebook.github.io/immutable-js/) for state as it just
makes sense.

(If I wanted to dig deeper, much of my interest in front-end development comes
from [David Nolen's work on CSP for UI
development](http://swannodette.github.io/2013/08/17/comparative). I feel CSP is
a lot like FRP, except rather than focusing in the conveyor belt it focuses on
the robots, so to speak.)

I then wanted to translate his mixin into a higher-order component. I stumbled
upon [Redux's connect
function](http://redux.js.org/docs/basics/UsageWithReact.html#container-components)
and fell in love. Moving to a higher-order component also had the unintended
effect of freeing up React's component state, which I find very nice to handle
strictly UI concerns.

To make sense of how this observer-based architecture should work I also took a
lot of inspiration from [NuclearJS](https://optimizely.github.io/nuclear-js/)
and [Yolk](https://github.com/garbles/yolk) and
[Tsers](https://github.com/tsers-js/examples) (from which I stole `explode`).
