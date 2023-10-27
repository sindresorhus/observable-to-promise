import observableToPromise from 'observable-to-promise';
import ObservableRxjs from 'rxjs';
import ObservableMost from 'most';
import ObservableZen from 'zen-observable';

console.log('rxjs');
const promiserxjs = await observableToPromise(ObservableRxjs.of(1, 2, 3, 4, 5), {maximumValues: 2});

console.log('most');
const promisemost = await observableToPromise(ObservableMost.of(1, 2, 3, 4, 5), {maximumValues: 2});

console.log('zen');
const promisezen = await observableToPromise(ObservableZen.of(1, 2, 3, 4, 5), {maximumValues: 2});

console.log(promiserxjs);
console.log(promisemost);
console.log(promisezen);
