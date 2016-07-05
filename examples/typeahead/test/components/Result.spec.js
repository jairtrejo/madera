import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Result from '../../src/components/Result.jsx';


test('it renders the result', t => {
    const wrapper = shallow(
        <Result result={ {name: 'Black Widow'} }
                onPick={ () => null } />
    );
    t.regex(wrapper.text(), /Black Widow/);
});

test('it sets selected class for the selected result', t => {
    const wrapper = shallow(
        <Result result={ {name: 'Black Widow'} }
                selected
                onPick={ () => null } />
    );
    t.is(wrapper.find('.result.selected').length, 1);
});

test('it calls onPick on click', t => {
    const onPick = sinon.spy();
    const wrapper = shallow(
        <Result result={ {name: 'Black Widow'} }
                onPick={ onPick }/>
    );

    wrapper.find('.result').simulate('click');
    t.true(onPick.calledOnce);
});
