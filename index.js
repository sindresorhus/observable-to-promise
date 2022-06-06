import isObservable from 'is-observable';
import symbolObservable from 'symbol-observable';

export default async function observableToPromise(value) {
	if (!isObservable(value)) {
		throw new TypeError(`Expected an \`Observable\`, got \`${typeof value}\``);
	}

	const values = [];

	return new Promise((resolve, reject) => {
		value[symbolObservable.default]().subscribe({
			next(value) {
				values.push(value);
			},
			error: reject,
			complete() {
				resolve(values);
			},
		});
	});
}
