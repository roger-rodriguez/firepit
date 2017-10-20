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
  schema: true,
  attributes: {
    name: {
      type: 'string',
    },
    noob: {
      type: 'boolean',
      defaultsTo: false,
    },
    age: {
      type: 'integer',
      required: true,
    },
  },
});

firebase.firepit().initialize();

// const query = firebase.firestore().collection('user').limit(1);
// query.get().then((snapshot1) => {
//   a = snapshot1.docs[0];
//   const batch = firebase.firestore().batch();
//   batch.delete(a.ref);
//   return batch.commit();
// }).then(() => {
//   return query.get();
// }).then((snapshot2) => {
//   const b = snapshot2.docs[0]
//   console.log(b.id)
//   debugger;
//   // snapshot1[0] === snapshot2[0]
// })


const User = firebase.firepit().model('User');

User.create({
  age: 69,
  name: 'foobar'
})
.then((res) => {
  debugger;
})
  .catch((e) => {
  debugger;
  })
// User.destroy({}, 1)
//   .then((doc) => {
//   debugger;
//   })
//   .catch((e) => {
//   debugger;
//   })


// User
// // .find({ name: 'elliot' })
// // .findOneByName('elliot')
//   .findByNoob(true)
//   .where({
//     age: {
//       $gte: 12,
//       $lte: 55,
//     },
//   })
//   .select(['age'])
//   // .findOne('dJbQltnAsv4wKuJTdxZU')
//   // .findOneById('dJbQltnAsv4wKuJTdxZU')
//   // .sort('age', 'asc')
//   // .sort({ age: 1 })
//   // .sort({ age: -1 })
//   // .sort('age', 'desc')
//   // .limit(1)
//   // .page(1)
//   .then((result) => {
//     console.dir(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });



// User.destroy({ name: 'elliot' })
//   .then((doc) => {
//   debugger;
//   })
//   .catch((e) => {
//   debugger;
//   })
