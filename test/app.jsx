'use strict';

var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var renderer = ReactTestUtils.createRenderer();
var TodoApp = require('../src/TodoApp.jsx');
var Container = require('../src/Container.jsx');
var TodoHeader = require('../src/TodoHeader.jsx');
var TodoItems = require('../src/TodoItems.jsx');
var TodoItem = require('../src/TodoItem.jsx');
var TodoFooter = require('../src/TodoFooter.jsx');
var TodoModel = require('../src/TodoModel.js');


describe('TodoMVC App', function() {
  var model;

  beforeEach(function() {
    localStorage.clear();
  });

  describe('when there Todo list start off empty', function() {
    beforeEach(function() {
      model = new TodoModel();
    });

    it('only renders a header when there are no items in the list', function() {
      // given
      renderer.render(<TodoApp model={model}/>);

      // then
      // TODO: upgrade to 'with all children' once <https://github.com/bruderstein/unexpected-react-shallow/issues/8> is resolved
      expect(renderer, 'to have rendered',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    it('allows an item to be added to the list', function() {
      // given
      var todoApp = <TodoApp model={model}/>;
// TODO: remove this Travis debug line
console.log($(todoApp).dom().outerHTML);
      var inputBox = $(todoApp).find('input.new-todo').dom();

      // when
      inputBox.value = 'Stuff';
      ReactTestUtils.Simulate.keyDown(inputBox, {key: 'Enter', keyCode: 13, which: 13});

      // then
      renderer.render(todoApp);
      expect(renderer, 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
          <TodoItems activeTodoCount={1}>
            <TodoItem title="Stuff" completed={false}/>
          </TodoItems>
          <TodoFooter count={1} completedCount={0} nowShowing="all"/>
        </Container>
      );
    });
  })

  describe('when the Todo list starts off with a single completed item', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.todos = [{id:'#1', title:'Stuff', completed:true}];
    });

    it('allows the item to be deleted', function() {
      // TODO...
    });

    it('removes the item if "clear all completed" is clicked', function() {
      // TODO...
    });
  });
});
