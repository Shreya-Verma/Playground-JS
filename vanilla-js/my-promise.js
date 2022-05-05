class MyPromise {
  constructor(executorFunc) {
    this.state = "PENDING";
    this.thenCallbacks = [];

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.handleError = () => {};
    executorFunc(this.resolve, this.reject);
  }

  resolve(value) {
    this.state = "RESOLVED";
    let storedValue = value;
    try {
      this.thenCallbacks.forEach((callback) => {
        storedValue = callback(storedValue);
      });
    } catch (error) {
      this.thenCallbacks = [];
      this.reject(error);
    }
  }

  reject(error) {
    this.state = "REJECTED";
    this.handleError(error);
  }

  then(successCallback) {
    this.thenCallbacks.push(successCallback);
    return this;
  }

  catch(errorCallback) {
    this.handleError = errorCallback;
    return this;
  }
}

//TEST CUSTOMPROMISE
fakeApiBackendCall = () => {
  const user = {
    userid: "011ABCT",
    firstName: "Shreya",
    lastName: "Verma",
    age: 30,
  };

  const error = {
    statusCode: 404,
    message: "Could not find user",
    error: "Not Found",
  };

  if (Math.random() > 0.05) {
    return {
      data: user,
      statusCode: 200,
    };
  } else {
    return error;
  }
};

let api = () => {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      const response = fakeApiBackendCall();
      if (response.statusCode >= 400) {
        reject(response);
      } else {
        resolve(response);
      }
    }, 3000);
  });
};

let response = api();
console.log(response);
response
  .then((response) => {
    console.log("In the first Then");
    console.log(response);
    return response.data;
  })
  .then((user) => {
    console.log(`User ${user.firstName}'s  age is ${user.age} ins second then`);
  })
  .catch((error) => {
    console.log(error.message);
  });
