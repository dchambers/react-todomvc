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
  beforeEach(function() {
    localStorage.clear();
  });

  it('only renders a header when there are no items in the list', function() {
    // given
    renderer.render(<TodoApp model={new TodoModel()}/>);

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
    var todoApp = <TodoApp model={new TodoModel()}/>;
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
});
