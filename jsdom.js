'use strict';
var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
	userAgent: 'node.js'
};
global.HTMLElement = require('jsdom/lib/jsdom/level1/core').HTMLElement;
