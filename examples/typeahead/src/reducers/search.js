import Immutable from 'immutable';
import { explode } from 'madera';


export default function searchReducer(action$){
    let {
        init$,
        search$,
        searchResults$,
        searchError$,
        picked$
    } = explode(action$);

    return [
        init$, state =>
            state.set('search', Immutable.Map({
                term: '',
                error: null,
                picked: null,
                results: null
            })),

        search$, (state, term) =>
            state.set('search', Immutable.Map({
                term,
                error: null,
                picked: null,
                results: null
            })),

        searchResults$, (state, results) =>
            state.setIn(['search', 'results'], results)
                 .setIn(['search', 'error'], null),

        searchError$, (state, error) =>
            state.setIn(['search', 'error'], "The Marvel API seems to be unavailable")
                 .setIn(['search', 'results'], null),

        picked$, (state, picked) =>
            state.setIn(['search', 'picked'], picked)
                 .setIn(['search', 'results'], null)
                 .setIn(['search', 'error'], null)
    ]
}

