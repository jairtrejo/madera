import test from 'ava';
import { Madera } from 'madera';

import counterReducer from '../../reducers/counter';


test.beforeEach(t => {
    t.context.madera = Madera(
        [counterReducer],
        ['INIT', 'INC', 'DEC']
    );
    t.context.state = null;
    t.context.madera.state$.onValue(s => t.context.state = s);
});

test('it initializes counter to 0', t =>{
    const { action$, state$, init } = t.context.madera;

    init();

    t.is(t.context.state.get('count'), 0);
})

test('it increments counter', t =>{
    const { action$, state$, init } = t.context.madera;

    init();
    action$.push({type: 'INC'});

    t.is(t.context.state.get('count'), 1);
})

test('it decrements counter', t =>{
    const { action$, state$, init } = t.context.madera;

    init();
    action$.push({type: 'DEC'});

    t.is(t.context.state.get('count'), -1);
})
