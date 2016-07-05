import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Spinner from 'react-spinkit';

import Results from '../../src/components/Results.jsx';


test('it renders the passed results', t => {
    const wrapper = shallow(
        <Results results={ [{id: '1'}, {id: '2'}] }
                 selected={ 0 }
                 onPick={ () => null } />
    );
    t.is(wrapper.find('Result').length, 2);
});

test('it renders up to 5 results', t => {
    const wrapper = shallow(
        <Results results={ 
                     Array(6).fill().map((_, i) => ({id: `${i}`}))
                 }
                 selected={ 0 }
                 onPick={ () => null } />
    );
    t.is(wrapper.find('Result').length, 5);
});

test('it renders a message if there are 0 results', t => {
    const wrapper = shallow(
        <Results results={ [] }
                 selected={ 0 }
                 onPick={ () => null } />
    );
    t.is(wrapper.find('.results').text(), 'No matches found');
});

test('it renders a spinner if there are no results yet', t => {
    const wrapper = shallow(
        <Results results={ null }
                 selected={ 0 }
                 onPick={ () => null } />
    );
    t.true(wrapper.contains(<Spinner spinnerName="three-bounce"/>));
});
