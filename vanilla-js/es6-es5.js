/**
 * Convert below given es6 class to es5


class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class User extends Person {
  constructor(myname, age) {
    super(myname);
    this.age = age;
  }

  getDetails() {
    return `My Name is ${super.getName()} and I am ${this.age} years old`;
  }
}

let user1 = new User("Shreya", 30);
console.log(user1.getDetails());
 */

let __extends = function (user, person) {
  function temp() {}
  temp.prototype = person.prototype;
  user.prototype = new temp();
};

let Person = (function () {
  function Person(name) {
    this.name = name;
  }
  Person.prototype.getName = function () {
    return `My Name is ${this.name}`;
  };

  return Person;
})();

let User = (function (Person) {
  //Extends;
  __extends(User, Person);

  function User(myname, age) {
    Person.call(this, myname);
    this.age = age;
  }

  User.prototype.getDetails = function () {
    return `I am ${this.age} years old`;
  };

  return User;
})(Person);

let user1 = new User("Shreya", 30);

console.log(user1.getName(), user1.getDetails());
console.log(user1);

let person = new Person("Blah");
console.log(person.getName());
console.log(person);
