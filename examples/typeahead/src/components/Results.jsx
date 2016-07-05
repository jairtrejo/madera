import React from 'react';
import Spinner from 'react-spinkit';

import Result from './Result.jsx';


export default function Results(props){
    const { results, selected, onPick } = props;

    let content = null;

    if (results === null) {
        content = <Spinner spinnerName="three-bounce"/>
    } else if (results.length === 0) {
        content = <p>No matches found</p>;
    } else {
        content = results.slice(0, 5).map(
            (r, idx) => (
                <Result key={ r.id }
                        result={ r }
                        selected={ idx === selected }
                        onPick={ onPick }/>
            ));
    }

    return (
        <div className="popover results">
            { content }
        </div>
    );
}

Results.propTypes = {
    results: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    })),
    selected: React.PropTypes.number.isRequired,
    onPick: React.PropTypes.func.isRequired
}
