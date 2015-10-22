'use strict';

var ALL_TODOS = 'all';
var ACTIVE_TODOS = 'active';
var COMPLETED_TODOS = 'completed';
var React = require('react');
var Container = require('./Container.jsx');
var TodoHeader = require('./TodoHeader.jsx');
var TodoFooter = require('./TodoFooter.jsx');
var TodoItems = require('./TodoItems.jsx');
var TodoItem = require('./TodoItem.jsx');

var TodoApp = React.createClass({
	getInitialState: function () {
		return {
			nowShowing: ALL_TODOS,
			editing: null
		};
	},

	componentWillMount: function () {
		var setState = this.setState;
		this.props.router.mount({
			'/': setState.bind(this, {nowShowing: ALL_TODOS}),
			'/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
			'/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
		});
		this.props.model.subscribe(this.forceUpdate.bind(this));
	},

	componentDidMount: function () {
		this.props.router.init('/');
	},

	handleTodoAdded: function (todo) {
		this.props.model.addTodo(todo);
	},

	handleToggleAll: function (event) {
		var checked = event.target.checked;
		this.props.model.toggleAll(checked);
	},

	handleToggle: function (todoToToggle) {
		this.props.model.toggle(todoToToggle);
	},

	handleDestroy: function (todo) {
		this.props.model.destroy(todo);
	},

	handleEdit: function (todo) {
		this.setState({editing: todo.id});
	},

	handleSave: function (todoToSave, text) {
		this.props.model.save(todoToSave, text);
		this.setState({editing: null});
	},

	handleCancel: function () {
		this.setState({editing: null});
	},

	handleClearCompleted: function () {
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
					editing={this.state.editing === todo.id}
					onToggle={this.handleToggle.bind(this, todo)}
					onDestroy={this.handleDestroy.bind(this, todo)}
					onEdit={this.handleEdit.bind(this, todo)}
					onSave={this.handleSave.bind(this, todo)}
					onCancel={this.handleCancel}
				/>
			);
		}, this);

		return (
			<Container componentName="TodoApp">
				<TodoHeader onTodoAdded={this.handleTodoAdded}/>
				{todos.length ? (
					<TodoItems activeTodoCount={model.activeTodoCount()} onToggleAll={this.handleToggleAll}>
						{todoItems}
					</TodoItems>
				) : null}
				{model.activeTodoCount() || model.completedCount() ? (
					<TodoFooter count={model.activeTodoCount()} completedCount={model.completedCount()}
						nowShowing={this.state.nowShowing} onClearCompleted={this.handleClearCompleted}
					/>
				) : null}
			</Container>
		);
	}
});

module.exports = TodoApp;
