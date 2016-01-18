import React from 'react';
import Component from 'react-es6-component';

export default class TodoItems extends Component {
	handleToggleAll(event) {
		this.props.onToggleAll(event.target.checked);
	}

	render() {
		return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={this.handleToggleAll}
          checked={this.props.activeTodoCount === 0}
        />
        <ul className="todo-list">
          {this.props.children}
        </ul>
      </section>
		);
	}
};
