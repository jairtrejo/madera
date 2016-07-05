import React from 'react';
import classNames from 'classnames';

import { connectComponent } from 'madera';


export function Selection(props){
    if (props.picked) {
        let { name, thumbnail, description } = props.picked;
        description = description.trim()

        return (
            <div className={ classNames("selection", {'no-description': !description}) }>
                <h2>{ name }</h2>
                <img src={ thumbnail.path + '.' + thumbnail.extension }
                     alt={ name }/>
                <p>{ description }</p>
            </div>
        );
    } else {
        return null;
    }
}


Selection.propTypes = {
    picked: React.PropTypes.shape({
        name: React.PropTypes.string,
        description: React.PropTypes.description,
        thumbnail: React.PropTypes.shape({
            path: React.PropTypes.string,
            extension: React.PropTypes.string
        })
    })
}


export default connectComponent(
    state$ => ({
        picked: state$.map('.getIn', ['search', 'picked'])
    })
)(Selection);
