'use strict';

var ALL_TODOS = 'all';
var ACTIVE_TODOS = 'active';
var COMPLETED_TODOS = 'completed';
var React = require('react');
var director = require('director');
var Container = require('./Container.jsx');
var TodoHeader = require('./TodoHeader.jsx');
var TodoFooter = require('./TodoFooter.jsx');
var TodoItems = require('./TodoItems.jsx');
var TodoItem = require('./TodoItem.jsx');

// TODO: find out why `director.Router.prototype` has less methods when run in Node.js
// TODO: consider whether routing should be done by the app rather than a React component anyway
if(!director.Router.prototype.init) {
	director.Router.prototype.init = function() {};
}

var TodoApp = React.createClass({
	getInitialState: function () {
		return {
			nowShowing: ALL_TODOS,
			editing: null
		};
	},

	componentDidMount: function () {
		var setState = this.setState;
		var router = new director.Router({
			'/': setState.bind(this, {nowShowing: ALL_TODOS}),
			'/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
			'/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
		});
		router.init('/');
	},

	addTodo: function (todo) {
		this.props.model.addTodo(todo);
	},

	toggleAll: function (event) {
		var checked = event.target.checked;
		this.props.model.toggleAll(checked);
	},

	toggle: function (todoToToggle) {
		this.props.model.toggle(todoToToggle);
	},

	destroy: function (todo) {
		this.props.model.destroy(todo);
	},

	edit: function (todo) {
		this.setState({editing: todo.id});
	},

	save: function (todoToSave, text) {
		this.props.model.save(todoToSave, text);
		this.setState({editing: null});
	},

	cancel: function () {
		this.setState({editing: null});
	},

	clearCompleted: function () {
		this.props.model.clearCompleted();
	},

	render: function () {
		var model = this.props.model;
		var todos = model.todos;

		var shownTodos = todos.filter(function (todo) {
			switch (this.state.nowShowing) {
			case ACTIVE_TODOS:
				return !todo.completed;
			case COMPLETED_TODOS:
				return todo.completed;
			default:
				return true;
			}
		}, this);

		var todoItems = shownTodos.map(function (todo) {
			return (
				<TodoItem
					key={todo.id}
					title={todo.title}
					completed={todo.completed}
					onToggle={this.toggle.bind(this, todo)}
					onDestroy={this.destroy.bind(this, todo)}
					onEdit={this.edit.bind(this, todo)}
					editing={this.state.editing === todo.id}
					onSave={this.save.bind(this, todo)}
					onCancel={this.cancel}
				/>
			);
		}, this);

		return (
			<Container componentName="TodoApp">
				<TodoHeader onTodoAdded={this.addTodo}/>
				{todos.length ? (
					<TodoItems activeTodoCount={model.activeTodoCount()} onToggleAll={this.toggleAll}>
						{todoItems}
					</TodoItems>
				) : null}
				{model.activeTodoCount() || model.completedCount() ? (
					<TodoFooter count={model.activeTodoCount()} completedCount={model.completedCount()}
						nowShowing={this.state.nowShowing} onClearCompleted={this.clearCompleted}
					/>
				) : null}
			</Container>
		);
	}
});

module.exports = TodoApp;
