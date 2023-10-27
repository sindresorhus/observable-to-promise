import test from 'ava';
import pIsPromise from 'p-is-promise';
import ZenObservable from 'zen-observable';
import xs from 'xstream';
import {from as rxFrom} from 'rxjs';
import * as most from 'most';
import toPromise from './index.js';

// Run tests for a given observable library
function testWithALib([libraryName, fromArray, failed]) {
	const fixture = [1, 2];

	test(`${libraryName}: observable to promise`, t => {
		t.true(pIsPromise(toPromise(fromArray(fixture))));
	});

	test(`${libraryName}: passes values through`, async t => {
		t.deepEqual(await toPromise(fromArray(fixture)), fixture);
	});

	test(`${libraryName}: rejects on error in observable`, async t => {
		await t.throwsAsync(toPromise(failed()));
	});
}

function testWithALibAndOptions([libraryName, fromArray, failed]) {
	const fixture = [1, 2, 3, 4, 5];
	const maximumValues = 3;

	test(`${libraryName}: return filtered by maximum values`, async t => {
		t.deepEqual(await toPromise(fromArray(fixture), {maximumValues}), fixture.slice(0, maximumValues));
	});

	test(`${libraryName}: rejects on error in observable with maximum values`, async t => {
		await t.throwsAsync(toPromise(failed(), {maximumValues}));
	});
}

// Run tests for the list of libraries
function testWithLibs(libraries) {
	for (const library of libraries) {
		testWithALibAndOptions(library);
		testWithALib(library);
	}
}

// Run tests not using any observables
function commonTests() {
	test('throw an error when an non-observable is given', async t => {
		await t.throwsAsync(toPromise(2), {instanceOf: TypeError});
	});
}

commonTests();

// Prepare constructors for each library
const reason = new Error('Rejected for testing');

const rejected = async () => {
	throw reason;
};

const zenFrom = array => ZenObservable.from(array);
const zenFailed = () => new ZenObservable(observer => observer.error(reason));

const xsFrom = array => xs.default.from(array);
const xsFailed = () => xs.default.fromPromise(rejected());

const rxFailed = () => rxFrom(rejected());

const mostFrom = array => most.from(array);
const mostFailed = () => most.fromPromise(rejected());

// Run tests with prepared constructors
testWithLibs([
	['zen-observable', zenFrom, zenFailed],
	['xstream', xsFrom, xsFailed],
	['RxJS 5', rxFrom, rxFailed],
	['most', mostFrom, mostFailed],
]);
