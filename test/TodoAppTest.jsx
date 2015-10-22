'use strict';

var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);
var sinon = require('sinon');

var React = require('react');
var director = require('director');
var TodoApp = require('../src/TodoApp.jsx');
var Container = require('../src/Container.jsx');
var TodoHeader = require('../src/TodoHeader.jsx');
var TodoItems = require('../src/TodoItems.jsx');
var TodoItem = require('../src/TodoItem.jsx');
var TodoFooter = require('../src/TodoFooter.jsx');
var TodoModel = require('../src/TodoModel.js');

function extractRoute(linkElem) {
  return linkElem.href.replace(/.*#/, '');
}

// TODO: find out why `director.Router.prototype` has less methods when run in Node.js
if(!director.Router.prototype.init) {
  director.Router.prototype.init = function() {};
}

describe('TodoMVC App', function() {
  var model, router;

  beforeEach(function() {
    router = new director.Router();
    localStorage.clear();
  });

  describe('UI bindings', function() {
    beforeEach(function() {
      this.addTodo = TodoApp.prototype.__reactAutoBindMap.addTodo;
    });

    afterEach(function() {
      TodoApp.prototype.__reactAutoBindMap.addTodo = this.addTodo;
    });

    it('allows the user to add items', function() {
      // given
      var model = new TodoModel();
      var todoApp = $(<TodoApp model={model} router={router}/>);
      var addTodo = sinon.stub(TodoApp.prototype.__reactAutoBindMap, 'addTodo');

      // when
      var inputBox = todoApp.render().find('input.new-todo');
      inputBox.dom().value = 'Stuff';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      sinon.assert.calledWith(addTodo, 'Stuff');
    });
  });

  describe('when the Todo list start off empty', function() {
    beforeEach(function() {
      model = new TodoModel();
    });

    it('only renders a header when there are no items in the list', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    it('allows an item to be added to the list', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoHeader')[0].props.onTodoAdded('Stuff');

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

    it('does not add an item to the list when an empty string is submitted', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      var inputBox = todoApp.render().find('input.new-todo');
      inputBox.dom().value = '';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });
  })

  describe('when the Todo list starts off with a single active item', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item-1');
    });

    it('updates the summary information when an items checkbox is ticked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.render().find('.todo-list .toggle').trigger('change', {'target': {'checked': true}});

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
          <TodoFooter count={0} completedCount={1} nowShowing="all"/>
      );
    });

    it('removes the items list and footer when the last item is removed', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.render().find('.destroy').trigger('click');

      // then
      expect(todoApp.shallowRender()[0], 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    xit('updates the footer information when the completed filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      var route = extractRoute(todoApp.render().find('a.completed').dom());
      router.dispatch('on', route);

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
        <TodoFooter nowShowing="completed"/>
      );
    });

    it('newly added items go to the bottom of the list', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      var inputBox = todoApp.render().find('input.new-todo');
      inputBox.dom().value = 'New-item';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
          <TodoItems activeTodoCount={2}>
            <TodoItem title="Item-1" completed={false}/>
            <TodoItem title="New-item" completed={false}/>
          </TodoItems>
      );
     });

     xit('displays a Clear Completed button when at least one item is marked as done', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      var route = extractRoute(todoApp.render().find('a.completed').dom());
      router.dispatch('on', route);

      // then
      // TODO this needs the model to change to make this testible, e.g. having a ClearCompleteVisible property
      expect(todoApp.shallowRender()[0], 'to contain',
        <TodoFooter count={1} completedCount={0} nowShowing="completed"/>
      );
    });

  });

  describe('when the Todo list contains multiple items', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item-1');
      model.addTodo('Item-2');
      model.addTodo('Item-3');
    });

    xit('hides active items when the completed filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      var route = extractRoute(todoApp.render().find('a.completed').dom());
      router.dispatch('on', route);

      // then
      expect(todoApp.render().find('li.todo-item').length, 'to equal', 0);
    });

    it('marks all items as done when the done when the toggle all arrow is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.render().find('.toggle-all').trigger('change', {'target': {'checked': true}});

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
          <TodoItems activeTodoCount={0}>
            <TodoItem title="Item-1" completed={true}/>
            <TodoItem title="Item-2" completed={true}/>
            <TodoItem title="Item-3" completed={true}/>
          </TodoItems>
      );
    });

  });

  describe('when the Todo list contains a mixture of completed and active items', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item-1');
      model.addTodo('Item-2');
      model.addTodo('Item-3');
      model.todos[1].completed = true;
    });

    xit('completed items are hidden from view when the active filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      // then
    });

    xit('completed items are hidden from view when the active filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      // then
    });

    it('removes only completed items when Clear Completed is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.render().find('.clear-completed').trigger('click');

      // then
      expect(todoApp.shallowRender()[0], 'to contain',
          <TodoItems activeTodoCount={2}>
            <TodoItem title="Item-1" completed={false}/>
            <TodoItem title="Item-3" completed={false}/>
          </TodoItems>
      );
    });
  });

  describe('when an active filter has been applied', function() {
    beforeEach(function() {
      model = new TodoModel();
      // TODO - select the active filter
    });

    xit('remembers filter setting when an item is added to an empty list', function() {
      // given
      var todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      // then
    });
  });

});
