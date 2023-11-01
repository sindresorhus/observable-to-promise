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
		throw new Error(`Expected \`maximumValues\` higher than 0, got \`${maximumValues}\``);
	}

	if (value.slice && maximumValues !== undefined) {
		value = value.slice(0, maximumValues);
	}

	const values = [];
	let count = 0;

	return new Promise((resolve, reject) => {
		value[symbolObservable.default]()
			.subscribe({
				next(value) {
					if (maximumValues === undefined) {
						values.push(value);
					}

					if (maximumValues > 0 && count < maximumValues) {
						values.push(value);
						count += 1;
					}

					if (count >= maximumValues) {
						resolve(values);
						console.log(count);
					}
				},
				error: reject,
				complete() {
					resolve(values);
				},
			});
	});
}
