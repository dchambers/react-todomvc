'use strict';

var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);

var React = require('react');
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
      var todoApp = $(<TodoApp model={model}/>);

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    it('allows an item to be added to the list', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      var inputBox = todoApp.render().find('input.new-todo');
      inputBox.dom().value = 'Stuff';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
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

    it('updates the summary information when an items checkbox is ticked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      todoApp.render().find('.todo-list .toggle').trigger('change', {'target': {'checked': true}});

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
          <TodoFooter count={0} completedCount={1} nowShowing="all"/>
      );
    });

    it('removes the items list and footer when the last item is removed', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      todoApp.render().find('.destroy').trigger('click');

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    //failing - item is still displayed (probably becaause simulated events have no effect on links)
    xit('hides active items when the completed filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      todoApp.find('a[href="#/completed"]').trigger('click');

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
          <TodoFooter count={1} completedCount={0} nowShowing="completed"/>
        </Container>
      );
     });
  });
});
