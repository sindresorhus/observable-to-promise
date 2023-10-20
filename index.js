
import isObservable from 'is-observable';
import symbolObservable from 'symbol-observable';

export default async function observableToPromise(value, maximumValues = 0) {
	if (!isObservable(value)) {
		throw new TypeError(`Expected an \`Observable\`, got \`${typeof value}\``);
	}

	const values = [];
	const count = 0;

	return new Promise((resolve, reject) => {
		value[symbolObservable.default]().subscribe({
			next(value) {
				if (maximumValues > 0 && count < maximumValues) {
					values.push(value);
					maximumValues += 1;
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
