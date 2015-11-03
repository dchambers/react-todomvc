import $ from 'teaspoon';
import unexpected from 'unexpected';
import unexpectedReactShallow from 'unexpected-react-shallow';
const expect = unexpected.clone().installPlugin(unexpectedReactShallow);
import sinon from 'sinon';

import React from 'react';
import director from 'director';

import TodoApp from '../src/TodoApp.jsx';
import Container from '../src/Container.jsx';
import TodoHeader from '../src/TodoHeader.jsx';
import TodoItems from '../src/TodoItems.jsx';
import TodoItem from '../src/TodoItem.jsx';
import TodoFooter from '../src/TodoFooter.jsx';
import TodoModel from '../src/TodoModel.js';

function extractRoute(linkElem) {
  return linkElem.href.replace(/.*#/, '');
}

// TODO: find out why `director.Router.prototype` has less methods when run in Node.js
if(!director.Router.prototype.init) {
  director.Router.prototype.init = function() {};
}

describe('TodoMVC App', function() {
  let model, router;

  beforeEach(function() {
    router = new director.Router();
    localStorage.clear();
  });

  describe('UI bindings', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item #1');
    });

    it('allows the user to add items', function() {
      // given
      let handleTodoAdded = sinon.spy();
      let todoHeader = $(<TodoHeader onTodoAdded={handleTodoAdded}/>);

      // when
      let inputBox = todoHeader.render().find('input.new-todo');
      inputBox.dom().value = 'Item #1';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      sinon.assert.calledWith(handleTodoAdded, 'Item #1');
    });

    it('does not allow the user to add emtpy items', function() {
      // given
      let handleTodoAdded = sinon.spy();
      let todoHeader = $(<TodoHeader onTodoAdded={handleTodoAdded}/>);

      // when
      let inputBox = todoHeader.render().find('input.new-todo');
      inputBox.dom().value = '';
      inputBox.trigger('keyDown', {key: 'Enter', keyCode: 13, which: 13});

      // then
      sinon.assert.notCalled(handleTodoAdded);
    });

    it('allows the user to check active items', function() {
      // given
      let handleToggle = sinon.spy();
      let todoItem = $(<TodoItem index={2} onToggle={handleToggle}/>);

      // when
      todoItem.render().find('.toggle').trigger('change', {'target': {'checked': true}});

      // then
      sinon.assert.calledWith(handleToggle, 2);
    });

    it('allows the user to destroy items', function() {
      // given
      let handleDestroy = sinon.spy();
      let todoItem = $(<TodoItem index={3} onDestroy={handleDestroy}/>);

      // when
      todoItem.render().find('.destroy').trigger('click');

      // then
      sinon.assert.calledWith(handleDestroy, 3);
    });

    it('allows the user to mark all items as completed', function() {
      // given
      let handleToggleAll = sinon.spy();
      let todoItems = $(<TodoItems onToggleAll={handleToggleAll}/>);

      // when
      todoItems.render().find('.toggle-all').trigger('change', {'target': {'checked': true}});

      // then
      sinon.assert.calledWith(handleToggleAll, true);
    });

    it('allows the user to unmark all items as completed', function() {
      // given
      let handleToggleAll = sinon.spy();
      let todoItems = $(<TodoItems onToggleAll={handleToggleAll}/>);

      // when
      todoItems.render().find('.toggle-all').trigger('change', {'target': {'checked': false}});

      // then
      sinon.assert.calledWith(handleToggleAll, false);
    });

    it('allows the user to clear completed items', function() {
      // given
      let handleClearCompleted = sinon.spy();
      let todoFooter = $(
        <TodoFooter count={1} completedCount={1} onClearCompleted={handleClearCompleted}/>
      );

      // when
      todoFooter.render().find('button.clear-completed').trigger('click');

      // then
      sinon.assert.calledOnce(handleClearCompleted);
    });

    it('allows the user to view all items', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(extractRoute(todoApp.render().find('a.all').dom()), 'to equal', '/');
    });

    it('allows the user to view active items', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(extractRoute(todoApp.render().find('a.active').dom()), 'to equal', '/active');
    });

    it('allows the user to view completed items', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(extractRoute(todoApp.render().find('a.completed').dom()), 'to equal', '/completed');
    });
  });

  describe('when the Todo list start off empty', function() {
    beforeEach(function() {
      model = new TodoModel();
    });

    it('only renders a header when there are no items in the list', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    it('allows an item to be added to the list', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoHeader').unwrap().props.onTodoAdded('Item #1');

      // then
      expect(todoApp.shallowRender().unwrap(), 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
          <TodoItems activeTodoCount={1}>
            <TodoItem title="Item #1" completed={false}/>
          </TodoItems>
          <TodoFooter count={1} completedCount={0} nowShowing="all"/>
        </Container>
      );
    });
  })

  describe('when the Todo list starts off with a single active item', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item #1');
    });

    it('starts off with a completed count of zero', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoFooter count={1} completedCount={0}/>
      );
    });

    it('updates the summary information when an items checkbox is ticked', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoItem').unwrap().props.onToggle(0);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoFooter count={0} completedCount={1}/>
      );
    });

    it('removes the items list and footer when the last item is removed', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoItem').unwrap().props.onDestroy(0);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to have rendered with all children',
        <Container componentName="TodoApp">
          <TodoHeader/>
        </Container>
      );
    });

    it('updates the footer information when the completed filter is clicked', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender();
      router.dispatch('on', '/completed');

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoFooter nowShowing="completed"/>
      );
    });

    it('adds new items to the bottom of the list', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoHeader').unwrap().props.onTodoAdded('Item #2');

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoItems activeTodoCount={2}>
          <TodoItem title="Item #1" completed={false}/>
          <TodoItem title="Item #2" completed={false}/>
        </TodoItems>
      );
    });
  });

  describe('when the Todo list contains multiple items', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item #1');
      model.addTodo('Item #2');
      model.addTodo('Item #3');
    });

    it('marks all items as done when the toggle-all arrow is clicked', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoItems').unwrap().props.onToggleAll(true);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoItems activeTodoCount={0}>
          <TodoItem title="Item #1" completed={true}/>
          <TodoItem title="Item #2" completed={true}/>
          <TodoItem title="Item #3" completed={true}/>
        </TodoItems>
      );
    });

  it('marks and then unmarks all items when the toggle-all arrow is clicked twice', function() {
    // given
    let todoApp = $(<TodoApp model={model} router={router}/>);

    // when
    todoApp.shallowRender().find('TodoItems').unwrap().props.onToggleAll(true);
    todoApp.shallowRender().find('TodoItems').unwrap().props.onToggleAll(false);

    // then
    expect(todoApp.shallowRender().unwrap(), 'to contain',
      <TodoItems activeTodoCount={3}>
        <TodoItem title="Item #1" completed={false}/>
        <TodoItem title="Item #2" completed={false}/>
        <TodoItem title="Item #3" completed={false}/>
      </TodoItems>
      );
    });
  });

  describe('when the Todo list contains a mixture of completed and active items', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item #1');
      model.addTodo('Item #2');
      model.addTodo('Item #3');
      model.todos[1].completed = true;
    });

    it('shows all items by default', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain with all children',
        <TodoItems activeTodoCount={2}>
          <TodoItem title="Item #1" completed={false}/>
          <TodoItem title="Item #2" completed={true}/>
          <TodoItem title="Item #3" completed={false}/>
        </TodoItems>
      );
    });

    it('does not show active items when the completed view is used', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender();
      router.dispatch('on', '/completed');

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain with all children',
        <TodoItems activeTodoCount={2}>
          <TodoItem title="Item #2" completed={true}/>
        </TodoItems>
      );
    });

    it('does not show completed items when the active view is used', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender();
      router.dispatch('on', '/active');

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain with all children',
        <TodoItems activeTodoCount={2}>
          <TodoItem title="Item #1" completed={false}/>
          <TodoItem title="Item #3" completed={false}/>
        </TodoItems>
      );
    });

    it('removes only completed items when clear-completed is clicked', function() {
      // given
      let todoApp = $(<TodoApp model={model} router={router}/>);

      // when
      todoApp.shallowRender().find('TodoFooter').unwrap().props.onClearCompleted();

      // then
      expect(todoApp.shallowRender().unwrap(), 'to contain',
        <TodoItems activeTodoCount={2}>
          <TodoItem title="Item #1" completed={false}/>
          <TodoItem title="Item #3" completed={false}/>
        </TodoItems>
      );
    });
  });
});
