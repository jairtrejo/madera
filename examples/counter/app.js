import React from 'react';
import ReactDOM from 'react-dom';
import { Madera, rootComponent } from 'madera';

import counterReducer from './reducers/counter';
import Counter from './components/Counter.jsx';


const { action$, state$, init } = Madera(
    [counterReducer], // List of reducers
    ['INIT', 'INC', 'DEC'] // List of action types
);

const Root = rootComponent(action$, state$, init)(Counter);
ReactDOM.render(<Root/>, document.getElementById('app'));
