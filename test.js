import test from 'ava';
import zenObservable from 'zen-observable';
import isPromise from 'is-promise';
import fn from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

test('observable to promise', t => {
	t.true(isPromise(fn(zenObservable.of(1, 2))));
});

test('ensures it always ends up being a promise', async t => {
	t.is(await fn(2), 2);
});

test('passes values through', async t => {
	t.same(await fn(zenObservable.of(1, 2)), [1, 2]);
});
