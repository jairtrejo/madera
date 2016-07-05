import Bacon from 'baconjs';
import Immutable from 'immutable';

import { asActionType, connectResource, Resource } from 'madera';


const BASE_URL = 'http://gateway.marvel.com:80/v1/public';


export class Marvel extends Resource {
    search(term) {
        return fetch(
            BASE_URL + `/characters?nameStartsWith=${encodeURIComponent(term)}&apikey=0f79e752406100744a5d71d822cfd49d`,
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Origin': 'http://jairtrejo.mx'
                }
            }
        ).then(
            response => response.json()
        ).then(data => {
            return data.data.results.filter(r => r.id)
                                    .map(r => ({ 
                                        id: `${r.id}` || r.name,
                                        name: r.name,
                                        description: r.description,
                                        thumbnail: r.thumbnail
                                    })
            );
        }).catch(response => {
            if (response && response.status === 500) {
                return Promise.reject('The Marvel API seems to be unavailable');
            } else {
                return response;
            }
        });
    }
}

export function needsSearch(search){
    return search
        && search.get('term') !== ''
        && search.get('results') === null;
}

export default connectResource(
    state$ => ({
        search: state$.map('.get', 'search')
                      .filter(needsSearch)
                      .map('.get', 'term')
                      .skipDuplicates()
    }),
    () => ({
        search: asActionType('SEARCH_RESULTS', 'SEARCH_ERROR'),
    })
)(Marvel);
