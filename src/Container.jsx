'use strict';

var React = require('react');

var Container = React.createClass({
	render: function () {
		return (
			<div className="{this.props.componentName}">{this.props.children}</div>
		);
	}
});

module.exports = Container;
