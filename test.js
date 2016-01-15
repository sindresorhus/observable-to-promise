import test from 'ava';
import zenObservable from 'zen-observable';
import isPromise from 'is-promise';
import fn from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

test('observable to promise', t => {
	t.true(isPromise(fn(zenObservable.of(1, 2))));
});

test('throw an error when an non observable is given', async t => {
	t.throws(() => fn(2), TypeError);
});

test('passes values through', async t => {
	t.same(await fn(zenObservable.of(1, 2)), [1, 2]);
});
