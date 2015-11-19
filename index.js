'use strict';
var isObservable = require('is-observable');
var symbolObservable = require('symbol-observable');

module.exports = function (x) {
	return isObservable(x) ? x[symbolObservable]().forEach(function () {}) : x;
};
