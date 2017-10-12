# Firepit

Firepit is a JavaScript ORM for [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/). It provides a common interface for interacting with the service inspired by [Mongoose](http://mongoosejs.com/) and [Waterline](https://github.com/balderdashy/waterline). Firepit allows you to be as explict or implicit as you want by defining your datastore in models.

```
npm install --save firepit
```

[Documentation](#)

## Example

```js
import firebase from 'firebase';
import firepit from 'firepit';

const app = firebase.initilizeApp({ ... });
firepit.use(app);

firebase.firepit().createModel('User', {
  attributes: {
    firstName: 'string',
    lastName: 'string',
    age: {
      type: 'integer',
      validate(age) {
        if (age < 18) throw new Error('Users must be over 18 years old!');
      },
    },
  },
});

firebase.firepit().initilize();

const User = firebase.firepit().model('User');

User
  .create({
    firstName: 'Ben',
    lastName: 'Dover',
    age: 17,
  })
  .then((user) => {
  
  })
  .catch((error) => {
    console.log(error.message); // Users must be over 18 years old!
  });
```
