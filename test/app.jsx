'use strict';

var $ = require('teaspoon');
var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);

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
    localStorage.clear();
  });

  describe('when the Todo list start off empty', function() {
    beforeEach(function() {
      model = new TodoModel();
      router = new director.Router();
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

    //TODO
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

    //TODO - fix
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

    //TODO
     xit('displays a Clear Completed button when at least one item is marked as done', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
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

    //TODO
    xit('marks all items as done when the done when the toggle all arrow is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
    });

  });

  describe('when the Todo list contains a mixture of completed and active items', function() {
    beforeEach(function() {
      model = new TodoModel();
      model.addTodo('Item-1');
      model.addTodo('Item-2');
      model.addTodo('Item-3');
      //TODO - mark one as completed
    });

    xit('completed items are hidden from view when the active filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
    });

    xit('completed items are hidden from view when the active filter is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
    });

    xit('removes only completed items when Clear Completed is clicked', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
    });

  });

  describe('when an active filter has been applied', function() {
    beforeEach(function() {
      model = new TodoModel();
      //TODO - selectd the active filter
    });

    xit('remembers filter setting when an item is added to an empty list', function() {
      // given
      var todoApp = $(<TodoApp model={model}/>);

      // when
      // then
    });
  });

});
