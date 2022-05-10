const states = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

const isThenable = (maybePromise) =>
  maybePromise && typeof maybePromise.then === "function";

/**
 *
 */
class MyPromise {
  constructor(executorFn) {
    this._state = states.PENDING;

    this._value = undefined;
    this._reason = undefined;

    this._thenQueue = [];

    if (typeof executorFn === "function") {
      //This executor has to be implemented to run asynchronously.
      //Delay the running of executor until the next event loop cycle by using setTimeout
      setTimeout(() => {
        try {
          executorFn(this._onFulfilled.bind(this), this._onRejected.bind(this));
        } catch (ex) {
          this._onRejected(ex);
        }
      });
    }
  }

  /**
   *
   * @param {*} fulfilledFn
   * @param {*} catchFn
   * @returns
   */
  then(fulfilledFn, catchFn) {
    // The first arg is a function, that Transforms the value if the promise is fulfilled;
    // The second  arg is also a function,Transforms the reason if the promise happens to reject

    const controlledPromise = new MyPromise();
    this._thenQueue.push([controlledPromise, fulfilledFn, catchFn]);

    if (this._state === states.FULFILLED) {
      this._propagateFulfilled();
    } else if (this._state === states.REJECTED) {
      this._propagateRejected();
    }
    // the then menthod returns a promise;
    return controlledPromise;
  }

  /**
   *
   * @param {*} catchFn
   * @returns
   */
  catch(catchFn) {
    //catch is a special case of then function
    return this.then(undefined, catchFn);
  }

  /**
   *
   */
  _propagateFulfilled() {
    //communicate with promise that is added in the queues
    // loop through the thenQueue

    //Destructure controlledPromise and fullfilledFn
    this._thenQueue.forEach(([controlledPromise, fulfilledFn]) => {
      if (typeof fulfilledFn === "function") {
        //if fullfilledFn is defined
        // resolves value or rejection reason

        //Parent promise Value
        const valueOrPromise = fulfilledFn(this._value);

        // isThenable: a utility funtion td determine, if the settled value of a promise is also a promise or a value
        if (isThenable(valueOrPromise)) {
          //The settled value of Parent promise is a promise.
          valueOrPromise.then(
            (value) => controlledPromise._onFulfilled(value),
            (reason) => controlledPromise._onRejected(reason)
          );
        } else {
          // The settles value of parent promise is a value.
          controlledPromise._onFulfilled(valueOrPromise);
        }
      } else {
        //if fullfilledFn is  NOT defined
        // The settles value of current/this promise is a value.
        return controlledPromise._onFulfilled(this._value);
      }
    });
    //Empty the then queue when all the promisses have been processed
    this._thenQueue = [];
  }

  /**
   *
   */
  _propagateRejected() {
    //Destructure controlledPromise and catchFn
    this._thenQueue.forEach(([controlledPromise, _, catchFn]) => {
      if (typeof catchFn === "function") {
        //Parent promise Reason
        const valueOrPromise = catchFn(this._reason);

        if (isThenable(valueOrPromise)) {
          valueOrPromise.then(
            (value) => controlledPromise._onFulfilled(value),
            (reason) => controlledPromise._onRejected(reason)
          );
        } else {
          //catch is used to recover from errors
          //catch is returning rejections back into normal promises
          controlledPromise._onFulfilled(valueOrPromise);
        }
      } else {
        return controlledPromise._onRejected(this._reason);
      }
    });

    this._thenQueue = [];
  }

  /**
   *
   * @param {*} value
   */
  _onFulfilled(value) {
    //only do these actions when in a pending state
    if (this._state === states.PENDING) {
      this._state = states.FULFILLED;
      this._value = value;
      this._propagateFulfilled();
    }
  }

  /**
   *
   * @param {*} reason
   */
  _onRejected(reason) {
    //only do these actions when in a pending state
    if (this._state === states.PENDING) {
      this._state = states.REJECTED;
      this._reason = reason;
      this._propagateRejected();
    }
  }
}

MyPromise.resolve = (value) => new MyPromise((resolve) => resolve(value));
MyPromise.reject = (reason) => new MyPromise((_, reject) => reject(reason));

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("Hello World!!"), 1000);
});

const firstThen = promise
  .then((value) => {
    console.log(`Get Value First: ${value}`);
    return MyPromise.resolve("My name is Shreya");
  })
  .catch((error) => {
    console.log(`Get Error Reason First:  ${error}`);
    return MyPromise.reject("error again!!");
  });

const secondThen = firstThen
  .then((value) => {
    console.log(`Get Value Second: ${value}`);
    return value + 1;
  })
  .catch((error) => {
    console.log(`Get Error Reason Second:  ${error}`);
  });
