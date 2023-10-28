# observable-to-promise

> Convert an [Observable](https://github.com/tc39/proposal-observable) to a Promise

## Install

```sh
npm install observable-to-promise
```

## Usage

```js
import observableToPromise from 'observable-to-promise';
import Observable from 'rxjs';

const promise = observableToPromise(Observable.of(1, 2));

console.log(await promise);
//=> [1, 2]
```

### Optional: maximum return values:
```js
import observableToPromise from 'observable-to-promise';
import Observable from 'rxjs';

const promise = observableToPromise(Observable.of(1, 2, 3, 4, 5), {maximumValues: 2});

console.log(await promise);

//=> [1, 2]
```

## Related

- [is-observable](https://github.com/sindresorhus/is-observable) - Check if a value is an Observable
