import Bacon from 'baconjs';
import Immutable from 'immutable';


export function Madera(reducers, actionTypes){
    const action$ = new Bacon.Bus();
    window.action$ = action$;
    action$.actionTypes = actionTypes;

    const state$ = Bacon.update(
        Immutable.Map(),
        // Last defined has precedence
        ...reducers.map(reducer => reducer(action$))
                   .reduce((a, b) => a.concat(b))
    );

    const init = () => action$.push({type: 'INIT'});

    return { action$, state$, init };
}

