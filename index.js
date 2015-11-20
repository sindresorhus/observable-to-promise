'use strict';
var isObservable = require('is-observable');
var symbolObservable = require('symbol-observable');

module.exports = function (x) {
	if (isObservable(x)) {
		var result = [];

		return x[symbolObservable]().forEach(function (value) {
			result.push(value);
		})
		.then(function () {
			return result;
		});
	}

	return Promise.resolve(x);
};
