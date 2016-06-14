import Bacon from 'baconjs';
import React from 'react';


export function connectComponent(propsFromState, actionsFromEvents){
    /*
     * Adapted from Niklas von Hertzen's React/Bacon example
     * https://github.com/niklasvh/react-bacon-flux-poc
     */
    return ComposedComponent => {
        class ConnectedComponent extends React.Component {
            constructor(props, context){
                super(props, context);

                this._streamTemplate = (typeof propsFromState === "function") ? Bacon.combineTemplate(propsFromState(this.context.state$)) : null;

                this.callbacks = {};
                if (typeof actionsFromEvents === "function") {
                    const mappings = actionsFromEvents();

                    for (let event of Object.keys(mappings)){
                        let event$toAction$ = mappings[event],
                            event$ = Bacon.Bus(),
                            action$ = event$toAction$(event$);

                        this.callbacks[event] = (payload) => event$.push(payload);
                        this.context.action$.plug(action$);
                    };
                }

                let tmp = null;
                if (this._streamTemplate) {
                    this._streamTemplate.onValue(function(value) {
                        tmp = value;
                    })();
                }

                this.state = tmp;
            }

            componentDidMount(){
                if (this._streamTemplate) {
                    this._boundCombineTemplate = this._streamTemplate.onValue(function(state) {
                        this.setState(state);
                    }.bind(this));
                }
            }

            componentWillUnmount(){
                if (this._boundCombineTemplate) {
                    this._boundCombineTemplate();
                }
            }

            render(){
                return (
                    <ComposedComponent { ...this.state } { ...this.props } { ...this.callbacks }>
                        { this.props.children }
                    </ComposedComponent>
                );
            }
        };

        ConnectedComponent.contextTypes = {
            state$: React.PropTypes.object,
            action$: React.PropTypes.object
        };

        ConnectedComponent.childContextTypes = {
            state$: React.PropTypes.object,
            action$: React.PropTypes.object
        };

        return ConnectedComponent;
    };
}

export { rootComponent } from './components/Root.js';
