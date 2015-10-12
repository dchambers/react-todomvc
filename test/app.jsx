'use strict';

var unexpected = require('unexpected');
var unexpectedReactShallow = require('unexpected-react-shallow');
var expect = unexpected.clone().installPlugin(unexpectedReactShallow);
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var renderer = ReactTestUtils.createRenderer();
var TodoApp = require('../src/TodoApp.jsx');
var TodoHeader = require('../src/TodoHeader.jsx');
var TodoModel = require('../src/TodoModel.js');

describe('TodoMVC App', function() {
  it('only renders a header when there are no items in the list', function() {
    renderer.render(<TodoApp model={new TodoModel()}/>);
    expect(renderer, 'to have rendered',
      <div>
        <TodoHeader/>
      </div>
    );
  });
});
