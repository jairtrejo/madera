import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Counter } from '../../components/Counter.jsx';


test('it renders two buttons', t => {
    const wrapper = shallow(<Counter count={ 0 }/>);
    t.is(wrapper.find('button').length, 2);
})

test('it calls inc on inc button click', t => {
    const inc = sinon.spy();
    const wrapper = shallow(<Counter inc={ inc }/>);

    wrapper.find('#inc-btn').simulate('click');
    t.true(inc.calledOnce);
})

test('it calls dec on dec button click', t => {
    const dec = sinon.spy();
    const wrapper = shallow(<Counter dec={ dec }/>);

    wrapper.find('#dec-btn').simulate('click');
    t.true(dec.calledOnce);
})
