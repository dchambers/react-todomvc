import $ from 'teaspoon';
import unexpected from 'unexpected';
import unexpectedReactShallow from 'unexpected-react-shallow';
const expect = unexpected.clone().installPlugin(unexpectedReactShallow);
import sinon from 'sinon';

import React from 'react';

import TodoItem from '../src/TodoItem.jsx';

const ESCAPE_KEY = 27;

describe('TodoItem', function() {
  describe('UI Bindings', function() {
  it('displays in the non-editing mode when the editing prop is false', function() {
    // given
    let todoItem = $(<TodoItem title="Item #1" editing={false}/>);

    // then
    expect(todoItem.shallowRender()[0], 'to have rendered',
      <li className="todo-item"/>
    );
  });

  it('displays in the editing mode when the editing prop is true', function() {
    // given
    let todoItem = $(<TodoItem title="Item #1" editing={true}/>);

    // then
    expect(todoItem.shallowRender()[0], 'to have rendered',
      <li className="todo-item editing"/>
    );
  });

  // TODO: we need to have a think about making this more testable -- at present
  // TodoItem is not fully encapsulated, and requires TodoApp to know about its
  // business
  it('cancels item editing when the escape key is pressed.', function() {
      // given
      let handleCancel = sinon.spy();
      let todoItem = $(<TodoItem title="Item #1" editing={true} onCancel={handleCancel}/>);

      // when
      todoItem.render().find('input.edit').trigger('keyDown', {key: 'Escape', keyCode: ESCAPE_KEY, which: ESCAPE_KEY});

      // then
      sinon.assert.calledOnce(handleCancel);
    });
  });
});
