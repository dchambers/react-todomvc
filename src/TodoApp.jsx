import React from 'react';
import Component from 'react-es6-component';

import Container from './Container.jsx';
import TodoHeader from './TodoHeader.jsx';
import TodoFooter from './TodoFooter.jsx';
import TodoItems from './TodoItems.jsx';
import TodoItem from './TodoItem.jsx';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nowShowing: ALL_TODOS,
			editing: null
		};
	}

	componentWillMount() {
		let setState = this.setState;
		this.props.router.mount({
			'/': setState.bind(this, {nowShowing: ALL_TODOS}),
			'/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
			'/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
		});
		this.props.model.subscribe(this.forceUpdate.bind(this));
	}

	componentDidMount() {
		this.props.router.init('/');
	}

	handleTodoAdded(todo) {
		this.props.model.addTodo(todo);
	}

	handleToggleAll(checked) {
		this.props.model.toggleAll(checked);
	}

	handleToggle(todoIndex) {
		let todo = this.props.model.todos[todoIndex];
		this.props.model.toggle(todo);
	}

	handleDestroy(todoIndex) {
		let todo = this.props.model.todos[todoIndex];
		this.props.model.destroy(todo);
	}

	handleEdit(todoIndex) {
		let todo = this.props.model.todos[todoIndex];
		this.setState({editing: todo.id});
	}

	handleSave(todoIndex, text) {
		let todo = this.props.model.todos[todoIndex];
		this.props.model.save(todo, text);
		this.setState({editing: null});
	}

	handleCancel() {
		this.setState({editing: null});
	}

	handleClearCompleted() {
		this.props.model.clearCompleted();
	}

	render() {
		let model = this.props.model;
		let todos = model.todos;

		let shownTodos = todos.filter(function (todo) {
			switch (this.state.nowShowing) {
			case ACTIVE_TODOS:
				return !todo.completed;
			case COMPLETED_TODOS:
				return todo.completed;
			default:
				return true;
			}
		}, this);

		let index = 0;
		let todoItems = shownTodos.map(function (todo) {
			return (
				<TodoItem
					index={index++}
					key={todo.id}
					title={todo.title}
					completed={todo.completed}
					editing={this.state.editing === todo.id}
					onToggle={this.handleToggle}
					onDestroy={this.handleDestroy}
					onEdit={this.handleEdit}
					onSave={this.handleSave}
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
}
