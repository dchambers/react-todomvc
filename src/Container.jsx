'use strict';

var React = require('react');

var Container = React.createClass({
	render: function () {
		return (
			<div class="{this.props.componentName}">{this.props.children}</div>
		);
	}
});

module.exports = Container;
