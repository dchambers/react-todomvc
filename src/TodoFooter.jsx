import React from 'react';
import cx from 'classnames';

import Utils from './Utils.js';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

export default function TodoFooter(props) {
	let activeTodoWord = Utils.pluralize(props.count, 'item');
	let clearButton = null;

	if (props.completedCount > 0) {
		clearButton = (
			<button
				className="clear-completed"
				onClick={props.onClearCompleted}>
				Clear completed
			</button>
		);
	}

	let nowShowing = props.nowShowing;
	return (
		<footer className="footer">
			<span className="todo-count">
				<strong>{props.count}</strong> {activeTodoWord} left
			</span>
			<ul className="filters">
				<li>
					<a
						href="#/"
						className={cx('all', {selected: nowShowing === ALL_TODOS})}>
							All
					</a>
				</li>
				{' '}
				<li>
					<a
						href="#/active"
						className={cx('active', {selected: nowShowing === ACTIVE_TODOS})}>
							Active
					</a>
				</li>
				{' '}
				<li>
					<a
						href="#/completed"
						className={cx('completed', {selected: nowShowing === COMPLETED_TODOS})}>
							Completed
					</a>
				</li>
			</ul>
			{clearButton}
		</footer>
	);
};
