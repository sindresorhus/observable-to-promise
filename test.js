/**
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
import pIsPromise from 'p-is-promise';
import ZenObservable from 'zen-observable';
import xs from 'xstream';
import Rx from 'rxjs';
import * as most from 'most';
import toPromise from '.';

/**
 * Run tests for a given observable library
 *
 * @param libName {string} the name of the lib under test
 * @param fromArray {(Array) => Observable} constructs observable from array
 * @param failed {() => Observable} returns an observable that terminates with error
 */
function testWithALib([libName, fromArray, failed]) {
	const array = [1, 2];

	test(`${libName}: observable to promise`, t => {
		const p = toPromise(fromArray(array));
		t.true(pIsPromise(p));
	});

	test(`${libName}: passes values through`, async t => {
		const p = toPromise(fromArray(array));
		t.deepEqual(array, await p);
	});

	test(`${libName}: rejects on error in observable`, t => {
		const p = toPromise(failed());
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

/* Prepare constructors for each lib */
const reason = 'Rejected for testing.';
const rejected = () => Promise.reject(reason);

const zenFrom = array => ZenObservable.from(array);
const zenFailed = () => new ZenObservable(observer =>
	observer.error(reason));

const xsFrom = array => xs.from(array);
const xsFailed = () => xs.fromPromise(rejected());

const rxFrom = array => Rx.Observable.from(array);
const rxFailed = () => Rx.Observable.fromPromise(rejected());

const mostFrom = array => most.from(array);
const mostFailed = () => most.fromPromise(rejected());

/* Finally, run tests with prepared constructors */
testWithLibs([
	['zen-observable', zenFrom, zenFailed],
	['xstream', xsFrom, xsFailed],
	['RxJS 5', rxFrom, rxFailed],
	['most', mostFrom, mostFailed]
]);
