import React from 'react';
import Component from 'react-es6-component';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class TodoItem extends Component {
	constructor(props) {
		super(props);
		this.state = {editText: this.props.title};
	}

	handleSubmit() {
		let val = this.state.editText.trim();
		if (val) {
			this.props.onSave(this.props.index, val);
			this.setState({editText: val});
		} else {
			this.props.onDestroy(this.props.index);
		}
	}

	handleEdit() {
		this.props.onEdit(this.props.index);
		this.setState({editText: this.props.title});
	}

	handleKeyDown(event) {
		if (event.which === ESCAPE_KEY) {
			this.setState({editText: this.props.title});
			this.props.onCancel(event);
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	}

	handleChange(event) {
		this.setState({editText: event.target.value});
	}

	handleToggle() {
		this.props.onToggle(this.props.index);
	}

	handleDestroy() {
		this.props.onDestroy(this.props.index);
	}

	/**
	 * This is a completely optional performance enhancement that you can
	 * implement on any React component. If you were to delete this method
	 * the app would still work correctly (and still be very performant!), we
	 * just use it as an example of how little code it takes to get an order
	 * of magnitude performance improvement.
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.title !== this.props.title ||
			nextProps.completed !== this.props.completed ||
			nextProps.editing !== this.props.editing ||
			nextState.editText !== this.state.editText
		);
	}

	/**
	 * Safely manipulate the DOM after updating the state when invoking
	 * `this.props.onEdit()` in the `handleEdit` method above.
	 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
	 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
	 */
	componentDidUpdate(prevProps) {
		if (!prevProps.editing && this.props.editing) {
			let node = React.findDOMNode(this.refs.editField);
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}
	}

	render() {
		return (
			<li className={classNames('todo-item', {
				completed: this.props.completed,
				editing: this.props.editing
			})}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.completed}
						onChange={this.handleToggle}
					/>
					<label onDoubleClick={this.handleEdit}>
						{this.props.title}
					</label>
					<button className="destroy" onClick={this.handleDestroy} />
				</div>
				<input
					ref="editField"
					className="edit"
					value={this.state.editText}
					onBlur={this.handleSubmit}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
				/>
			</li>
		);
	}
}
