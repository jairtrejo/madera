import test from 'ava';
import Immutable from 'immutable';
import { Madera, explode } from 'madera';

import searchReducer from '../../src/reducers/search';


function setStateReducer(action$){
    const { set$ } = explode(action$);

    return [
        set$, (state, payload) =>
            payload.path ? state.setIn(payload.path, payload.state) : payload.state
    ];
}

test.beforeEach(t => {
    t.context.madera = Madera(
        [searchReducer, setStateReducer],
        ['INIT', 'SET', 'SEARCH', 'SEARCH_RESULTS', 'SEARCH_ERROR', 'PICKED']
    );
    t.context.state = null;
    t.context.madera.state$.onValue(s => t.context.state = s);
});

test('it initializes search state', t => {
    const { init } = t.context.madera;

    init();

    t.deepEqual(t.context.state.get('search').toJS(), {
        term: '',
        results: null,
        error: null,
        picked: null
    });
})

test('it sets term on search', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({type: 'SEARCH', payload: 'Captain'});

    t.is(t.context.state.getIn(['search', 'term']), 'Captain');
})

test('it resets fields on search', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({
        type: 'SET',
        payload: {path: ['search', 'results'], state: ['Spider-Man', 'Spider-Woman']}
    });
    action$.push({type: 'SEARCH', payload: 'Spider'});
    t.is(t.context.state.getIn(['search', 'results']), null);

    action$.push({
        type: 'SET',
        payload: {path: ['search', 'error'], state: 'Some error'}
    });
    action$.push({type: 'SEARCH', payload: 'Spider'});
    t.is(t.context.state.getIn(['search', 'error']), null);

    action$.push({
        type: 'SET',
        payload: {path: ['search', 'picked'], state: {name: 'Daredevil', id: '3'}}
    });
    action$.push({type: 'SEARCH', payload: 'Spider'});
    t.is(t.context.state.getIn(['search', 'picked']), null);
})

test('it sets error', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({type: 'SEARCH_ERROR', payload: 'Some error'});
    t.is(t.context.state.getIn(['search', 'error']), 'The Marvel API seems to be unavailable');
});

test('it resets results on error', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({
        type: 'SET',
        payload: {
            path: ['search', 'results'],
            state: ['Captain America', 'Captain Marvel']
        }
    });

    action$.push({type: 'SEARCH_ERROR', payload: 'Some error'});
    t.is(t.context.state.getIn(['search', 'results']), null);
});

test('it sets picked', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({type: 'PICKED', payload: {id: 1, name: 'Wolverine'}});

    t.deepEqual(
        t.context.state.getIn(['search', 'picked']),
        {id: 1, name: 'Wolverine'}
    );
});

test('it resets results and error on picked', t => {
    const { action$, init } = t.context.madera;
    init();

    action$.push({
        type: 'SET',
        payload: {
            path: ['search', 'results'],
            state: ['Captain America', 'Captain Marvel']
        }
    });
    action$.push({type: 'PICKED', payload: {id: 1, name: 'Wolverine'}});

    t.is(t.context.state.getIn(['search', 'results']), null);

    action$.push({
        type: 'SET',
        payload: {
            path: ['search', 'error'],
            state: 'Some error'
        }
    });
    action$.push({type: 'PICKED', payload: {id: 1, name: 'Wolverine'}});

    t.is(t.context.state.getIn(['search', 'error']), null);
});
