import test from 'ava';
import isPromise from 'is-promise';

import zenObservable from 'zen-observable';
import xs from 'xstream';

import toPromise from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

let array = [1, 2];

/**
 * Run tests for a given observable library
 *
 * @param libName {string} the name of the lib under test
 * @param fromArray {(Array) => Observable} constructor of observable from array
 */
function testOneLib(libName, fromArray) {
	test(`${libName}: observable to promise`, t => {
		t.true(isPromise(toPromise(fromArray(array))));
	});

	test(`${libName}: passes values through`, async t => {
		t.deepEqual(array, await toPromise(fromArray(array)));
	});
}

function commonTests() {
	test('throw an error when an non observable is given', async t => {
		t.throws(() => toPromise(2), TypeError);
	});
}

/* run common tests */
commonTests()

/* run tests for zenObservable */
let zenFrom = array => zenObservable.from(array);
testOneLib('zenObservable', zenFrom);

/* run tests for xstream */
let xsFrom = array => xs.from(array);
testOneLib('xstream', xsFrom);
