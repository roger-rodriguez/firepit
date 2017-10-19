# Firepit<a href="https://firepit.io"><img align="left" src="https://i.imgur.com/J9PHR7p.png"></a>

[![npm version](https://img.shields.io/npm/v/firepit.svg?style=flat-square)](https://www.npmjs.com/package/firepit)
[![NPM downloads](https://img.shields.io/npm/dm/firepit.svg?style=flat-square)](https://www.npmjs.com/package/firepit)
[![Package Quality](http://npm.packagequality.com/shield/firepit.svg?style=flat-square)](http://packagequality.com/#?package=firepit)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?style=flat-square)](https://discord.gg/t6bdqMs)
[![Donate](https://img.shields.io/badge/Donate-Patreon-green.svg?style=flat-square)](https://www.patreon.com/invertase)

Firepit is a Node ORM for [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/). It provides a common interface for interacting with the service inspired by [Mongoose](http://mongoosejs.com/) and [Waterline](https://github.com/balderdashy/waterline). Firepit allows you to be as explict or implicit as you want by defining your datastore in models.

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

# Transaction Example

## Increment a value new way

#### Model

```javascript
// our model created at app / page / process startup
const City = firebase.firepit().createModel('City', {
  // turn off automatic document id generation
  autoId: false,

  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true, // specify that this is to be used as id

      // i want id to be between 2 - and 24 chars:
      validate(value) {
        return value.length >= 2 && value.length < 24;
      }
    },

    name: {
      type: 'string',
      required: true,
    },

    population: {
      type: 'integer',
      defaultsTo: 0,
      validate(value) {
        return value >= 0 && value < 1000000;
      }
    },
  },
});
```

#### Increment Code

```javascript
// in your logic elsewhere:
City
  .update('SF', {
    $inc: {
      population: 1,
    },
  })
  .then((cityDocument) => {
    console.log(cityDocument.population);
  });
```



--------

## Increment a value old way

#### Increment Code

```javascript
var cityRef = db.collection('cities').doc('SF');
var transaction = db.runTransaction(t => {
    return t.get(cityRef)
        .then(doc => {
            var newPopulation = doc.data().population + 1;
            if (newPopulation <= 1000000) {
                t.update(cityRef, { population: newPopulation });
                return Promise.resolve('Population increased to ' + newPopulation);
            } else {
                return Promise.reject('Sorry! Population is too big.');
            }
        });
})
.then(result => {
    console.log('Transaction success', result);
})
.catch(err => {
    console.log('Transaction failure:', err);
});
```
