'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var TodoApp = require('./TodoApp.jsx');
var TodoModel = require('./TodoModel.js');
var model = new TodoModel('react-todos');
var director = require('director');
var router = new director.Router();

function render() {
	ReactDOM.render(
		<TodoApp model={model} router={router}/>,
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();
