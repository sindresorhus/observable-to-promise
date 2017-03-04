/**
 * Tests for observable-to-promise module
 *
 * function commonTests() contains tests which don't use any observables
 *
 * function testWithLibs() invoked with array of items, that each contains
 * library name and two functions:
 * - constructor of observable from array: (Array) => Observable
 * - constructor of observable which terminates with an error: () => Observable
 *
 * To add under the test one more library just prepare and pass one more array
 * to the `testWithLibs` function.
 */
import test from 'ava';
import isPromise from 'is-promise';

import ZenObservable from 'zen-observable';
import xs from 'xstream';
import Rx from 'rxjs';
import * as most from 'most';

import toPromise from './';

// for `zen-observable` on Node.js 0.10
global.Promise = Promise;

/**
 * Run tests for a given observable library
 *
 * @param libName {string} the name of the lib under test
 * @param fromArray {(Array) => Observable} constructs observable from array
 * @param failed {() => Observable} returns an observable that terminates with error
 */
function testWithALib([libName, fromArray, failed]) {
	let array = [1, 2];

	test(`${libName}: observable to promise`, t => {
		let p = toPromise(fromArray(array));
		t.true(isPromise(p));
	});

	test(`${libName}: passes values through`, async t => {
		let p = toPromise(fromArray(array));
		t.deepEqual(array, await p);
	});

	test(`${libName}: rejects on error in observable`, t => {
		let p = toPromise(failed());
		t.throws(p);
	});
}

/**
 * Run tests for the list of libs
 *
 * @param libs {[libName, fromArray]}
 */
function testWithLibs(libs) {
	libs.forEach(testWithALib);
}

/** Run tests not using any observables */
function commonTests() {
	test('throw an error when an non observable is given', async t => {
		t.throws(() => toPromise(2), TypeError);
	});
}

commonTests();

/* prepare constructors for each lib */
let reason = 'Rejected for testing.';
let rejected = () => Promise.reject(reason);

let zenFrom = array => ZenObservable.from(array);
let zenFailed = () => new ZenObservable(observer =>
	observer.error(reason));

let xsFrom = array => xs.from(array);
let xsFailed = () => xs.fromPromise(rejected());

let rxFrom = array => Rx.Observable.from(array);
let rxFailed = () => Rx.Observable.fromPromise(rejected());

let mostFrom = array => most.from(array);
let mostFailed = () => most.fromPromise(rejected());

/* finally, run tests with prepared constructors */
testWithLibs([
	['zen-observable', zenFrom, zenFailed],
	['xstream', xsFrom, xsFailed],
	['RxJS 5', rxFrom, rxFailed],
	['most', mostFrom, mostFailed]
]);
