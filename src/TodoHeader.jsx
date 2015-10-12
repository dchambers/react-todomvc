/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
'use strict';

var ENTER_KEY = 13;
var React = require('react');

var TodoHeader = React.createClass({
	handleKeyDown: function (event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		var val = React.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.onTodoAdded(val);
			React.findDOMNode(this.refs.newField).value = '';
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
