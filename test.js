import test from 'ava';
import zenObservable from 'zen-observable';
import isPromise from 'is-promise';
import m from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

test('observable to promise', t => {
	t.true(isPromise(m(zenObservable.of(1, 2))));
});

test('throw an error when an non observable is given', async t => {
	t.throws(() => m(2), TypeError);
});

test('passes values through', async t => {
	t.deepEqual(await m(zenObservable.of(1, 2)), [1, 2]);
});
