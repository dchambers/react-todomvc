'use strict';

var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
//var expect = unexpected.clone().installPlugin(unexpectedReactShallow);
var expect = require('chai').expect;

var React = require('react');
var director = require('director');
var TodoApp = require('../src/TodoApp.jsx');
var Container = require('../src/Container.jsx');
var TodoHeader = require('../src/TodoHeader.jsx');
var TodoItems = require('../src/TodoItems.jsx');
var TodoItem = require('../src/TodoItem.jsx');
var TodoFooter = require('../src/TodoFooter.jsx');
var TodoModel = require('../src/TodoModel.js');
var ReactTestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');

function extractRoute(linkElem) {
	return linkElem.href.replace(/.*#/, '');
}

// TODO: find out why `director.Router.prototype` has less methods when run in Node.js
if(!director.Router.prototype.init) {
	director.Router.prototype.init = function() {};
}

describe('TodoMVC App - Test Profiling', function() {
	var model, router;

	beforeEach(function() {
		localStorage.clear();
		model = new TodoModel();
		router = new director.Router();
	});


	// //Shallow rendering assertion
	//for (var x = 0; x < 10000; x++) {
	//	it('allows an item to be added to the list - virtualDOM', function () {
	//		// given
	//		var todoApp = $(<TodoApp model={model} router={router}/>);
	//
	//		// when
	//		var inputBox = todoApp.render().find('input.new-todo');
	//		inputBox.dom().value = 'Stuff';
	//		inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});
	//
	//		// then
	//		expect(todoApp.shallowRender()[0], 'to have rendered with all children',
	//			<Container componentName="TodoApp">
	//				<TodoHeader/>
	//				<TodoItems activeTodoCount={1}>
	//					<TodoItem title="Stuff" completed={false}/>
	//				</TodoItems>
	//				<TodoFooter count={1} completedCount={0} nowShowing="all"/>
	//			</Container>
	//		);
	//	});
	//}
	//
	//// RenderIntoDocument -> Simulate event -> assert model
	//// via https://facebook.github.io/react/docs/test-utils.html
	//for (var x = 0; x < 10000; x++) {
	//	it('allows an item to be added to the list - dom -> assert model', function () {
	//		//Given
	//
	//		this.component = ReactTestUtils.renderIntoDocument(<TodoApp model={model} router={router}/>);
	//		this.renderedDOM = ReactDOM.findDOMNode(this.component);
	//
	//		//When
	//		var inputDOM = this.renderedDOM.querySelector('.new-todo');
	//		inputDOM.value = 'ABCDEF';
	//		ReactTestUtils.Simulate.change(inputDOM);
	//		ReactTestUtils.Simulate.keyDown(inputDOM, {key: 'Enter', keyCode: 13, which: 13});
	//
	//		//Then
	//		expect(this.component.props.model.todos[0].title).equals('ABCDEF');
	//
	//	});
	//}
});
