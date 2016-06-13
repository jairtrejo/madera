import { explode } from '../../madera';

export function replaceStateReducer(action$){
    const { stateLoaded$ } = explode(action$);
    return [
        stateLoaded$, (oldState, newState) => newState ? newState : oldState
    ];
}

