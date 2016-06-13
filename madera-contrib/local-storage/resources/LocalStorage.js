import Immutable from 'immutable';

import { asActionType } from '../../../madera';
import { Resource, connectResource } from '../../../madera/resources';


class LocalStorage extends Resource {
    constructor(context, options){
        super(context);
        options = Object.assign({}, options);
        this.name = options.name || 'state';
        this.reviver = options.reviver;
    }

    load(){
        const stateJSON = localStorage.getItem(this.name);

        let state = null;

        if (stateJSON) {
            if (this.reviver) {
                state = Immutable.fromJS(JSON.parse(stateJSON), this.reviver);
            } else {
                state = Immutable.fromJS(JSON.parse(stateJSON));
            }
        }

        return Promise.resolve(state);
    }

    save(state){
        let stateJSON = JSON.stringify(state.toJS());
        localStorage.setItem(this.name, stateJSON);
        return Promise.resolve();
    }
}

export default connectResource(
    (state$) => ({
        load: state$.filter(state => state.size === 0),
        save: state$
    }),
    () => ({
        load: asActionType('STATE_LOADED'),
        save: asActionType('STATE_SAVED')
    })
)(LocalStorage);

