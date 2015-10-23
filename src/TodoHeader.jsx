'use strict';

import React from 'react';
import Component from 'react-es6-component';
import ReactDOM from 'react-dom';

const ENTER_KEY = 13;

export default class TodoHeader extends Component {
	constructor(props) {
		super(props);
	}

	handleKeyDown(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		let val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.onTodoAdded(val);
			ReactDOM.findDOMNode(this.refs.newField).value = '';
		}
	}

	render() {
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
};
