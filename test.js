import test from 'ava';
import zenObservable from 'zen-observable';
import isPromise from 'is-promise';
import fn from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

test(t => {
	t.true(isPromise(fn(zenObservable.of(1, 2))));
	t.end();
});
