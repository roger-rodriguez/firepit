const firebase = require("firebase-admin");
const firepit = require('./src');
const serviceAccount = require('./firepit.json');

const app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://firepit-tests.firebaseio.com"
});

firepit.use(app, {
  // default models config goes here
  scoobyDoo() {
    console.log('where are you');
  },
  attributes: {
    scoobyDoo: {
      type: 'string',
      defaultsTo: 'where are you',
    }
  },
});

// this now returns
const alsoReturnsTheModel = firebase.firepit().createModel('User', {
  attributes: {
    firstName: 'string',
    lastName: 'string',
    age: {
      type: 'integer',
      // todo these not supported yet - also validate + type is overspecifing? (throw an error i reckon, one or the other, not both)
      validate(age) {
        if (age < 18) throw new Error('Users must be over 18 years old!');
      },
    },
  },
});

// todo I figured out how to move to internals and automatically init on first module use
// so will remove once i sort that
firebase.firepit().initialize();

const User = firebase.firepit().model('User');

User
  .findOne({
    name: 'elliot',
  })
  .then((user) => {
    console.dir(user)
  })
  .catch((error) => {
    console.log(error.message); // Users must be over 18 years old!
  });
