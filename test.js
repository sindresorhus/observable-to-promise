/**
 * Tests for observable-to-promise module
 *
 * function commonTests() contains tests which don't use any observables
 *
 * function testLibs() is invoked with the list of : library name,
 * and fromArray fabric. To add test for one more library just pass
 * one more array to the `testLibs` function.
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
 * @param fromArray {(Array) => Observable} constructor of observable from array
 * @param failed {() => Observable} returns an observable that terminates with error
 */
function testOneLib([libName, fromArray, failed]) {
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
function testLibs(libs) {
	libs.forEach(testOneLib);
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

/* finally, run the tests for all libs */
testLibs([
	['zen-observable', zenFrom, zenFailed],
	['xstream', xsFrom, xsFailed],
	['RxJS 5', rxFrom, rxFailed],
	['most', mostFrom, mostFailed]
]);
