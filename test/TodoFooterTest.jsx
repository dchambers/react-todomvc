var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);

var React = require('react');

var TodoFooter = require('../src/TodoFooter.jsx');

describe('Todo Footer', function() {
	// TODO: enable this test once <https://github.com/bruderstein/unexpected-react-shallow/issues/10> is resolved
	xit('does not display the clear all completed items button if there are no completed items', function() {
		// given
		var todoFooter = $(<TodoFooter count={1} completedCount={0} nowShowing="all"/>);

		// then
		expect(todoFooter.shallowRender()[0], 'not to contain',
			<button className="clear-completed"/>
		);
	});

	it('displays the clear all completed items button if there are completed items', function() {
		// given
		var todoFooter = $(<TodoFooter count={1} completedCount={1} nowShowing="all"/>);

		// then
		expect(todoFooter.shallowRender()[0], 'to contain',
			<button className="clear-completed">
				Clear completed
			</button>
		);
	});
});
