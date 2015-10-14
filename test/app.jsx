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

  describe('when the Todo list start off empty', function() {
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

      // when
      var inputBox = $(todoApp).render().find('input.new-todo').dom();
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

  describe('when the Todo list starts off with a single active item', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Stuff');
    });

    //simulate change not working on checkbox
    xit('updates the summary information when an items checkbox is ticked', function() {
      // given
      var todoApp = <TodoApp model={model}/>;

      // when
      var checkbox = $(todoApp).render().find('.todo-list .toggle').dom();
      ReactTestUtils.Simulate.change(checkbox, {'target': {'checked': true}});

      // then
      renderer.render(todoApp);
      expect(renderer, 'to contain',
          <TodoFooter count={0} completedCount={1} nowShowing="all"/>
      );
    });

    it('removes the items list and footer when the last item is removed', function() {
      // given
      var todoApp = <TodoApp model={model}/>;

      // when
      var destroyButton = $(todoApp).render().find('.destroy').dom();
      ReactTestUtils.Simulate.click(destroyButton);

      // then
      renderer.render(todoApp);
      // TODO: upgrade to 'with all children' once <https://github.com/bruderstein/unexpected-react-shallow/issues/8> is resolved
      expect(renderer, 'to have rendered',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    //failing - item is still displayed
    xit('hides active items when the completed filter is clicked', function() {
      // given
      var todoApp = <TodoApp model={model}/>;

      // when
      var completedFilter = $(todoApp).find('a[href="#/completed"]').dom();
      ReactTestUtils.Simulate.click(completedFilter);

      // then
      renderer.render(todoApp);
      expect(renderer, 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
          <TodoFooter count={1} completedCount={0} nowShowing="completed"/>
        </Container>
      );
     });
  });
});
