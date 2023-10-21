
import isObservable from 'is-observable';
import symbolObservable from 'symbol-observable';

/**
 * @template T
 * @param {Observable<T>} value
 * @param {number} param1
 * @returns {Promise<T[]>}
 */
export default async function observableToPromise(value, options) {
	const {maximumValues = 0} = options || {};

	if (!isObservable(value)) {
		throw new TypeError(`Expected an \`Observable\`, got \`${typeof value}\``);
	}

	const values = [];
	let count = 0;

	return new Promise((resolve, reject) => {
		value[symbolObservable.default]().subscribe({
			next(value) {
				if (maximumValues > 0 && count < maximumValues) {
					values.push(value);
					count += 1;
				}

				if (maximumValues === 0) {
					values.push(value);
				}
			},
			error: reject,
			complete() {
				resolve(values);
			},
		});
	});
}
