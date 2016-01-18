'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './TodoApp.jsx';
import TodoModel from './TodoModel.js';
import director from 'director';

let model = new TodoModel('react-todos');
let router = new director.Router();

ReactDOM.render(
	<TodoApp model={model} router={router}/>, document.getElementsByClassName('todoapp')[0]
);
