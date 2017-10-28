# Firepit<a href="https://firepit.io"><img align="left" src="https://i.imgur.com/3y5vVOf.png" width="50"></a>

[![npm version](https://img.shields.io/npm/v/firepit.svg?style=flat-square)](https://www.npmjs.com/package/firepit)
[![NPM downloads](https://img.shields.io/npm/dm/firepit.svg?style=flat-square)](https://www.npmjs.com/package/firepit)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?style=flat-square)](https://discord.gg/t6bdqMs)
[![Donate](https://img.shields.io/badge/Donate-Patreon-green.svg?style=flat-square)](https://www.patreon.com/invertase)


Firepit is a JavaScript ORM for [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/). It provides a common interface for interacting with the service inspired by [Mongoose](http://mongoosejs.com/) and [Waterline](https://github.com/balderdashy/waterline). Firepit allows you to be as explict or implicit as you want by defining your datastore in models.

<b>|</b> [Documentation](https://firepit.io/docs) <b>|</b> [npm](https://www.npmjs.com/package/firepit) <b>|</b>

```bash
npm install --save firepit
```

## Quick Start

```js
const firebase = require('firebase-admin');
const firepit = require('firepit');
const app = firebase.initializeApp(...);

firepit.use(app);

const User = firebase.firepit().createModel('User', {
  attributes: {
    name: 'string',
    age: {
      type: 'integer',
      validate(age) {
        if (age < 18) throw new Error('Users must be at least 18 years old.');
      },
    },
  },
});

User
  .create({
    name: 'Ben Dover',
    age: 20,
  })
  .then((created) => {
      console.log('User created!', created);
  });
```
