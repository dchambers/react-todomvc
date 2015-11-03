import $ from 'teaspoon';
import unexpected from 'unexpected';
import unexpectedReactShallow from 'unexpected-react-shallow';
const expect = unexpected.clone().installPlugin(unexpectedReactShallow);

import React from 'react';

import TodoFooter from '../src/TodoFooter.jsx';

describe('Todo Footer', function() {
	// TODO: enable this test once <https://github.com/bruderstein/unexpected-react-shallow/issues/10> is resolved
	xit('does not display the clear all completed items button if there are no completed items', function() {
		// given
		let todoFooter = $(<TodoFooter count={1} completedCount={0} nowShowing="all"/>);

		// then
		expect(todoFooter.shallowRender().unwrap(), 'not to contain',
			<button className="clear-completed"/>
		);
	});

	it('displays the clear all completed items button if there are completed items', function() {
		// given
		let todoFooter = $(<TodoFooter count={1} completedCount={1} nowShowing="all"/>);

		// then
		expect(todoFooter.shallowRender().unwrap(), 'to contain',
			<button className="clear-completed">
				Clear completed
			</button>
		);
	});
});
