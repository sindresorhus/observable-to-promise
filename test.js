/**
 * Tests for observable-to-promise module
 *
 * function commonTests() contains tests which dont use any observables
 *
 * function testLibs is invoked with the list of pairs: library name,
 * and fromArray fabric. To add test for one more library just pass
 * one more array to the `testLibs` function.
 */
import test from 'ava';
import isPromise from 'is-promise';

import zenObservable from 'zen-observable';
import xs from 'xstream';
import Rx from 'rxjs';
import * as most from 'most';

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
function testOneLib([libName, fromArray]) {
	test(`${libName}: observable to promise`, t => {
		t.true(isPromise(toPromise(fromArray(array))));
	});

	test(`${libName}: passes values through`, async t => {
		t.deepEqual(array, await toPromise(fromArray(array)));
	});
}

/**
 * Run tests for the list of libs
 *
 * @param libs {[libName, fromArray]}
 */
function testLibs(libs) {
	libs.forEach(testOneLib);
}

/**
 * Run tests not related to any lib
 */
function commonTests() {
	test('throw an error when an non observable is given', async t => {
		t.throws(() => toPromise(2), TypeError);
	});
}

/* run tests that don't use any observables */
commonTests();

/* prepare the 'fromArray' constructor for each lib */
let zenFrom = array => zenObservable.from(array);
let xsFrom = array => xs.from(array);
let rxFrom = array => Rx.Observable.from(array);
let mostFrom = array => most.from(array);

/* finally, run the tests for all libs */
testLibs([
	['zenObservable', zenFrom],
	['xstream', xsFrom],
	['RxJS 5', rxFrom],
	['most', mostFrom]
]);
