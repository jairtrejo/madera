import React from 'react';


export function rootComponent(action$, state$, init){
    return ComposedComponent => {
        class Root extends React.Component {
            componentWillMount(){
                this.state = { action$, state$ };
                init();
            }

            getChildContext() {
                const {action$, state$} = this.state;
                return { action$, state$ };
            }

            render(){
                return (
                    <ComposedComponent { ...this.props }>
                        { this.props.children }
                    </ComposedComponent>
                );
            }
        }

        Root.childContextTypes = {
            state$: React.PropTypes.object,
            action$: React.PropTypes.object
        };

        return Root;
    }
}
