
import isObservable from 'is-observable';
import symbolObservable from 'symbol-observable';

/**
 * @template T
 * @param {T extends unknown<T>} value
 * @param {{maximumValues?: number}} options
 * @returns {Promise<T[]>}
 */
export default async function observableToPromise(value, {maximumValues = undefined} = {}) {
	if (!isObservable(value)) {
		throw new TypeError(`Expected an \`Observable\`, got \`${typeof value}\``);
	}

	if (maximumValues < 0) {
		throw new Error(`Expected \`maximumValues higher than 0\`, got \`${maximumValues}\``);
	}

	const takeWhile = await getTakeWhileBasedOnLibrary(value);

	const values = [];
	let count = 1;

	return new Promise((resolve, reject) => {
		if (maximumValues === undefined) {
			value[symbolObservable.default]()
				.subscribe({
					next(value) {
						values.push(value);
					},
					error: reject,
					complete() {
						resolve(values);
					},
				});
			return;
		}

		if (getObservableLibrary(value) === 'RxJS') {
			console.log('rxjs');
			value[symbolObservable.default]()
				.pipe(takeWhile(() => count <= maximumValues))
				.subscribe({
					next(value) {
						if (maximumValues > 0 && count <= maximumValues) {
							values.push(value);
							count += 1;
						}
					},
					error: reject,
					complete() {
						resolve(values);
					},
				});
			return;
		}

		if (takeWhile === undefined) {
			value[symbolObservable.default]()
				.subscribe({
					next(value) {
						if (maximumValues > 0 && count <= maximumValues) {
							values.push(value);
							count += 1;
						}
					},
					error: reject,
					complete() {
						resolve(values);
					},
				});
		}
	});
}

async function getObservableLibrary(observable) {
	const rxjs = await import('rxjs');
	if (observable instanceof rxjs.Observable) {
		return 'RxJS';
	}

	const most = await import('most');
	if (observable instanceof most.Stream) {
		return 'RxJS';
	}

	return 'unknown';
}

async function getTakeWhileBasedOnLibrary(observable) {
	const library = getObservableLibrary(observable);

	if (library === 'RxJS') {
		const {takeWhile} = await import('rxjs');
		return takeWhile;
	}

	return undefined;
}
