'use strict';

var React = require('react');

var TodoItems = React.createClass({
	render: function () {
		return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={this.props.onToggleAll}
          checked={this.props.activeTodoCount === 0}
        />
        <ul className="todo-list">
          {this.props.children}
        </ul>
      </section>
		);
	}
});

module.exports = TodoItems;
