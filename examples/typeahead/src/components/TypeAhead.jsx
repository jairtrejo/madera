import React from 'react';
import Spinner from 'react-spinkit';
import { connectComponent, asActionType } from 'madera';

import Results from './Results.jsx';


export class TypeAhead extends React.Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            search: props.picked ? props.picked.name : '',
            selected: 0
        };

        this.onSearch = this.onSearch.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.picked && this.props.picked !== nextProps.picked) {
            this.setState({
                search: nextProps.picked.name,
                selected: 0
            });
        }
    }

    onSearch(e){
        const value = e.target.value;

        this.setState({ search: value });
        this.props.onSearch(value);
    }

    _normalize(s){
        const totalResults = Math.min(this.props.results.length, 5);

        if (s < 0) {
            return totalResults + s;
        } else {
            return s % totalResults;
        }
    }

    onKeyUp(e){
        if (!this.props.results) {
            return;
        }

        if (e.keyCode === 40) {

            this.setState({selected: this._normalize(this.state.selected + 1)});

        } else if (e.keyCode === 38) {

            this.setState({selected: this._normalize(this.state.selected - 1)});

        } else if (e.keyCode === 13 || e.keyCode === 9) {

            const picked = this.props.results[this.state.selected];
            this.props.onPick(picked)

        } else {

            return;

        }

        e.preventDefault();
    }

    render(){
        let popover, errorMsg;

        if (!this.state.search || this.props.picked || this.props.error) {
            popover = null;
        } else {
            popover = (
                <Results results={ this.props.results }
                         selected={ this.state.selected }
                         onPick={ this.props.onPick } />
            );
        }

        if (this.props.error) {
            errorMsg = <p className="error">{ this.props.error }</p>;
        } else {
            errorMsg = null;
        }

        return (
            <div className="typeahead">
                <input type="text"
                       value={ this.state.search }
                       onChange={ this.onSearch }
                       onKeyUp={ this.onKeyUp }/>
                { errorMsg }
                { popover }
            </div>
        )
    }
}

TypeAhead.propTypes = {
    results: React.PropTypes.array,
    error: React.PropTypes.string,
    picked: React.PropTypes.shape({
        name: React.PropTypes.string
    }),
    onSearch: React.PropTypes.func.isRequired,
    onPick: React.PropTypes.func.isRequired
}

export default connectComponent(
    state$ => ({
        results: state$.map('.getIn', ['search', 'results']),
        error: state$.map('.getIn', ['search', 'error']),
        picked: state$.map('.getIn', ['search', 'picked'])
    }),
    () => ({
        onSearch: event$ => asActionType('SEARCH')(event$.debounce(300)),
        onPick: asActionType('PICKED')
    })
)(TypeAhead);
