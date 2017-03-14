'use strict';
var isObservable = require('is-observable');
var symbolObservable = require('symbol-observable');

module.exports = function (val) {
	if (!isObservable(val)) {
		throw new TypeError('Expected an observable');
	}

	var ret = [];

	return new Promise((resolve, reject) => {
		val[symbolObservable]()
			.subscribe({
				next: x => ret.push(x),
				error: err => reject(err),
				complete: () => resolve(ret)
			});
	});
};
