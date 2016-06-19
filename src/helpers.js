import Bacon from 'baconjs';


function _snakeToCamel(s){
    // From https://coderwall.com/p/iprsng/convert-snake-case-to-camelcase
    return s.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
}


export function explode(action$){
    let exploded = {};

    // Values in action$ look like { type: TOGGLE_ACTION, payload: {} }

    for (let actionType of action$.actionTypes) {
        let streamName = _snakeToCamel(actionType.toLowerCase()) + '$';
        exploded[streamName] =
            action$.filter(({ type }) => type === actionType)
                   .map(({ payload }) => payload);
    }

    return exploded;
}


export function asActionType(actionType, errorActionType){
    if (!Array.isArray(actionType)) {
        actionType = [actionType];
    }

    if (errorActionType && !Array.isArray(errorActionType)) {
        errorActionType = [errorActionType];
    }

    if (errorActionType) {
        return event$ => 
            event$.flatMap(
                      payload => Bacon.sequentially(
                          0, actionType.map(type => ({type, payload}))))
                  .flatMapError(
                      payload => Bacon.sequentially(
                          0, errorActionType.map(type => ({type, payload}))
                  )
            );
    } else {
        return event$ => event$.flatMap(payload => Bacon.fromArray(
                                   actionType.map(type => ({type, payload}))));
    }
}
