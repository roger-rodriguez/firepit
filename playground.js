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
      defaultsTo: 1 //'where are you',
    }
  },
});


const alsoReturnsTheModel = firebase.firepit().createModel('User', {
  attributes: {
    name: {
      type: 'string',
    },
    noob: {
      type: 'boolean',
    },
    age: {
      type: 'integer',
    },
  },
});

firebase.firepit().initialize();

const User = firebase.firepit().model('User');

User
  // .find({ name: 'elliot' })
  // .findOneByName('elliot')
  // .findByNoob(true)
  // .where({ age: 12 })
  // .findOne('dJbQltnAsv4wKuJTdxZU')
  .findOneById('dJbQltnAsv4wKuJTdxZU')
  // .sort('age', 'asc')
  // .sort({ age: 1 })
  // .sort({ age: -1 })
  // .sort('age', 'desc')
  // .limit(1)
  .then((result) => {
    console.dir(result);
  })
  .catch((error) => {
    console.error(error);
  });

