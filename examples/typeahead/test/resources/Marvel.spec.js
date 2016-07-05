import fs from 'fs';
import test from 'ava';
import Immutable from 'immutable';
import fetchMock from 'fetch-mock';

import { Marvel, needsSearch } from '../../src/resources/Marvel';


test.beforeEach(fetchMock.restore);


test('it searches when there is a term and results are empty', t => {
    const state = Immutable.Map({
        term: 'Thor',
        results: null
    });

    t.true(needsSearch(state));
})


test('it doesn\'t search when there is no term', t => {
    const state = Immutable.Map({
        term: '',
        results: null
    });

    t.false(needsSearch(state));
})


test('it doesn\'t search when there are results', t => {
    const state = Immutable.Map({
        term: 'Thor',
        results: [{id: '1', name: 'Thor'}]
    });

    t.false(needsSearch(state));
})


test.serial('it returns the API results', t => {
    const marvel = new Marvel(null);

    const apiResponse = fs.readFileSync('./fixtures/api-response.json', 'utf8').toString();
    fetchMock.mock('^http://gateway.marvel.com', apiResponse);

    return marvel.search('Blob').then(results => {
        t.deepEqual(results[0], {
            id: '1009199',
            name: 'Blob',
            description: '',
            thumbnail: {
                path: 'http://i.annihil.us/u/prod/marvel/i/mg/1/10/4c7c648178328',
                extension: 'png'
            }
        })
    });
});


test.serial('it works when the API results are empty', t => {
    const marvel = new Marvel(null);

    const apiResponse = fs.readFileSync('./fixtures/empty-response.json', 'utf8').toString();
    fetchMock.mock('^http://gateway.marvel.com', apiResponse);

    return marvel.search('Blobo').then(results => {
        t.is(results.length, 0);
    });
});


test.serial('it returns a nice error message on API error', t => {
    const marvel = new Marvel(null);

    fetchMock.mock('^http://gateway.marvel.com', 500);

    return marvel.search('Deadpool').catch(error => {
        t.is(error, 'The Marvel API seems to be unavailable');
    });
})
