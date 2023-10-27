
import isObservable from 'is-observable';
import symbolObservable from 'symbol-observable';

/**
 * @template T
 * @param {T extends unknown<T>} value
 * @param {{maximumValues?: number}} options
 * @returns {Promise<T[]>}
 */
export default async function observableToPromise(value, {maximumValues = 0} = {}) {
	if (!isObservable(value)) {
		throw new TypeError(`Expected an \`Observable\`, got \`${typeof value}\``);
	}

	const values = [];
	let count = 0;

	return new Promise((resolve, reject) => {
		const subscription = value[symbolObservable.default]().subscribe({
			next(value) {
				if (maximumValues > 0 && count < maximumValues) {
					values.push(value);
					count += 1;
				}

				if (maximumValues === 0) {
					values.push(value);
				}

				if (maximumValues === (count - 1)) {
					console.log('closing');
					subscription.unsubcribe();
				}
			},
			error: reject,
			complete() {
				resolve(values);
			},
		});
	});
}
