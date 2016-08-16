import Bacon from 'baconjs';


export class Resource {
    constructor(context) {
        this.context = context;
    }
}


export function connectResource(operationsFromState, actionsFromResults, userOptions){
    const options = Object.assign(
        {}, { flatMapLatest: true }, userOptions
    );

    return (ComposedResource) => {
        class ConnectedResource extends Resource {
            constructor(...args) {
                super(...args);
                const resource = new ComposedResource(...args);

                let operations = operationsFromState(this.context.state$);
                let actionMappings = actionsFromResults();

                for (let operation_name of Object.keys(operations)){
                    let state$ToOperation$ = operations[operation_name];
                    let result$toAction$ = actionMappings[operation_name];

                    let result$ = state$ToOperation$[options.flatMapLatest ? 'flatMapLatest' : 'flatMap'](
                        state => Bacon.fromPromise(resource[operation_name](state))
                    );

                    this.context.action$.plug(result$toAction$(result$));
                }
            }
        }

        return ConnectedResource;
    };
}
