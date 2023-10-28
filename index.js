
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

	const takeWhile = await getTakeWhileForLibrary(value);

	const values = [];
	let count = 1;

	return new Promise((resolve, reject) => {
		if (getObservableLibrary(value) === 'RxJS') {
			value[symbolObservable.default]()
				.pipe(takeWhile(() => count <= maximumValues))
				.subscribe({
					next(value) {
						console.log(count);
						if (maximumValues > 0 && count <= maximumValues) {
							values.push(value);
							count += 1;
						}

						if (maximumValues === undefined) {
							values.push(value);
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

function getObservableLibrary(observable) {
	if (observable.constructor) {
		const constructorName = observable.constructor.name;
		console.log('constructorName', constructorName);
		switch (constructorName) {
			case 'Observable': {
				return 'RxJS';
			}

			case 'Stream': {
				return 'Most.js';
			}

			case 'ZenObservable': {
				return 'Zen Observable';
			}

			case 'XStream': {
				return 'xstream';
			}

			default: {
				return 'Unknown';
			}
		}
	}

	return 'Unknown';
}

async function getTakeWhileForLibrary(observable) {
	const library = getObservableLibrary(observable);

	if (library === 'RxJS') {
		const {takeWhile} = await import('rxjs');
		return takeWhile;
	}

	if (library === 'Most.js') {
		const {takeWhile} = await import('most/dist/most');
		return takeWhile;
	}

	return undefined;
}
