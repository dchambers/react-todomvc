'use strict';

var ENTER_KEY = 13;
var React = require('react');
var ReactDOM = require('react-dom');

var TodoHeader = React.createClass({
	handleKeyDown: function (event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		var val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.onTodoAdded(val);
			ReactDOM.findDOMNode(this.refs.newField).value = '';
		}
	},

	render: function () {
		return (
      <header className="header">
        <h1>todos</h1>
        <input
          ref="newField"
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={this.handleKeyDown}
          autoFocus={true}
        />
      </header>
		);
	}
});

module.exports = TodoHeader;
