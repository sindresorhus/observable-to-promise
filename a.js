import observableToPromise from 'observable-to-promise';

const promise = observableToPromise(Observable.of(1, 2, 3, 4, 5), {maximumValues: 2});

console.log(await promise);
