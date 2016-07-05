import React from 'react';
import ReactDOM from 'react-dom';
import { Madera, rootComponent, explode } from 'madera';

import searchReducer from './reducers/search';
import App from './components/App.jsx';
import MarvelResource from './resources/Marvel';


function setStateReducer(action$){
    const { set$ } = explode(action$);

    return [
        set$, (state, payload) =>
            payload.path ? state.setIn(payload.path, payload.state) : payload.state
    ];
}

const context = Madera(
    [searchReducer, setStateReducer], // List of reducers
    ['INIT', 'SET', 'SEARCH', 'SEARCH_RESULTS', 'SEARCH_ERROR', 'PICKED'] // List of action types
);
const { action$, state$, init } = context;

const resources = [
    new MarvelResource(context)
];

state$.onValue(state => window.state = state.toJS());
window.action$ = action$;

const Root = rootComponent(action$, state$, init)(App);
ReactDOM.render(<Root/>, document.getElementById('app'));
