
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
		throw new TypeError(`Expected \`maximumValues higher than 0\`, got \`${maximumValues}\``);
	}

	const values = [];
	let count = 1;

	return new Promise((resolve, reject) => {
		value[symbolObservable.default]().subscribe({
			next(value) {
				if (maximumValues > 0 && count <= maximumValues) {
					values.push(value);
					count += 1;
				}

				if (maximumValues === undefined) {
					values.push(value);
				}

				if (maximumValues === (count - 1)) {
					// eslint-disable-next-line no-warning-comments
					// TODO close observable
				}
			},
			error: reject,
			complete() {
				resolve(values);
			},
		});
	});
}
