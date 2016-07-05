import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import { Selection } from '../../src/components/Selection.jsx';


test('it renders name and description', t => {
    const wrapper = shallow(
        <Selection picked={{
            name: 'Hulk',
            description: 'Green',
            thumbnail: {path: 'hulk', extension: 'jpg'}
        }} />
    );

    t.regex(wrapper.text(), /Hulk/);
    t.regex(wrapper.text(), /Green/);
});

test('it renders thumbnail', t => {
    const wrapper = shallow(
        <Selection picked={{
            name: 'Hulk',
            description: 'Green',
            thumbnail: {path: 'hulk', extension: 'jpg'}
        }} />
    );

    t.is(wrapper.find('img').prop('src'), 'hulk.jpg');
});

test('it sets no-description class when description is empty', t=> {
    const wrapper = shallow(
        <Selection picked={{
            name: 'Hulk',
            description: '',
            thumbnail: {path: 'hulk', extension: 'jpg'}
        }} />
    );

    t.is(wrapper.find('.selection.no-description').length, 1);
})

test('it treats whitespace description as empty', t=> {
    const wrapper = shallow(
        <Selection picked={{
            name: 'Hulk',
            description: ' ',
            thumbnail: {path: 'hulk', extension: 'jpg'}
        }} />
    );

    t.is(wrapper.find('.selection.no-description').length, 1);
})
