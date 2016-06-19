import { explode } from 'madera';


export default function counterReducer(action$){
    let { init$, inc$, dec$ } = explode(action$);

    return [
        init$, state => state.set('count', 0),
        inc$, state => state.update('count', c => ++c),
        dec$, state => state.update('count', c => --c)
    ]
}

