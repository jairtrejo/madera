import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { TypeAhead } from '../../src/components/TypeAhead.jsx';


const someHeroes = [
    {id: '1', name: 'Spider-Man'},
    {id: '2', name: 'Spider-Woman'}
];


test('it provides an empty text input', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ null }
                   picked={ null }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    t.is(wrapper.find('input[type="text"]').prop('value'), '');
});

test('it pre-populates the text-field with the current pick', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ null }
                   picked={ {name: 'Ultron'} }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    t.is(wrapper.find('input[type="text"]').prop('value'), 'Ultron');
});

test('it resets input field if pick changes', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ null }
                   picked={ {name: 'Captain America'} }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    wrapper.setProps({picked: {name: 'Captain Marvel'}})

    t.is(wrapper.find('input[type="text"]').prop('value'), 'Captain Marvel');
})

test('it renders an error when present', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ 'Some error' }
                   picked={ null }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    t.is(wrapper.find('.error').text(), 'Some error');
});

test('it renders a popover with results when present', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ null }
                   picked={ null }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    wrapper.find('input[type="text"]').simulate('change', {target: {value: 'Spider'}});
    wrapper.setProps({results: someHeroes})

    t.is(wrapper.find('Results').length, 1);
});

test('it renders a popover with results even when there are zero', t => {
    const wrapper = shallow(
        <TypeAhead results={ null }
                   error={ null }
                   picked={ null }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );

    wrapper.find('input[type="text"]').simulate('change', {target: {value: 'Hulk'}});
    wrapper.setProps({results: []})

    t.is(wrapper.find('Results').length, 1);
});

test('it lets you scroll "selected" up and down', t => {
    const wrapper = shallow(
        <TypeAhead results={ someHeroes }
                   error={ null }
                   picked={ null }
                   onPick={ () => null }
                   onSearch={ () => null } />
    );
    const preventDefault = sinon.spy();

    t.is(wrapper.state('selected'), 0);

    wrapper.find('input[type="text"]').simulate('keyUp', {
        keyCode: 38, // down arrow
        preventDefault: preventDefault
    });
    t.is(wrapper.state('selected'), 1);

    wrapper.find('input[type="text"]').simulate('keyUp', {
        keyCode: 38,
        preventDefault: preventDefault
    });
    t.is(wrapper.state('selected'), 0);

    wrapper.find('input[type="text"]').simulate('keyUp', {
        keyCode: 40, // up arrow
        preventDefault: preventDefault
    });
    t.is(wrapper.state('selected'), 1);

    t.is(preventDefault.callCount, 3);
});

test('it lets you pick a result with the keyboard', t => {
    const onPick = sinon.spy();
    const preventDefault = sinon.spy();

    const wrapper = shallow(
        <TypeAhead results={ someHeroes }
                   error={ null }
                   picked={ null }
                   onPick={ onPick }
                   onSearch={ () => null } />
    );

    t.is(wrapper.state('selected'), 0);

    wrapper.find('input[type="text"]').simulate('keyUp', {
        keyCode: 13, // enter
        preventDefault: preventDefault
    });

    t.true(onPick.calledWith(someHeroes[0]));
});
