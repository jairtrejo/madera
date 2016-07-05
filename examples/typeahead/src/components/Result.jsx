import React from 'react';
import classNames from 'classnames';
import { connectComponent, asActionType } from 'madera';


export default function Result(props){
    const result = props.result;

    return (
        <div className={ classNames('result', {'selected': props.selected}) }
             onClick={ r => props.onPick(result) }>
            { result.name }
        </div>
    );
}

Result.propTypes = {
    selected: React.PropTypes.bool,
    result: React.PropTypes.shape({
        name: React.PropTypes.string
    }).isRequired,
    onPick: React.PropTypes.func.isRequired
}
