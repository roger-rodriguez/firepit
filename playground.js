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
    posts: {
      collection: 'post',
    },
    company: {
      model: 'company',
    }


    // age: {
    //   type: 'integer',
    //   validate(age) {
    //     if (age < 18) throw new Error('Users must be over 18 years old!');
    //   },
    // },
  },
});

firebase.firepit().initialize();

const User = firebase.firepit().model('User');

Company
  .findOneByName('Provide the Solutions Limited')
  // .populate('posts', {
  //   comments_count: {
  //     $gte: 10,
  //   }
  // })
  .then((company) => {
    const ref = company.ref;

    User.create({
      name: 'ewehrehjt',
      company: ref,
    }).then

    // for (let i = 0, len = usersArray.length; i < len; i++) {
    //   const user = usersArray[i];
    //   console.log(user);
    // }
    //
    // usersArray.nextPage().then(() => {
    //
    // })
  })
  .catch((error) => {
    console.log(error.message); // Users must be over 18 years old!
  });

//
//
// User
//   .find({ noob: true })
//   .page(1)
//   .limit(10)
//   .then()

// Users-- -
// UserPosts - ^
// UserPostComments - ^

// before
// firestore
//   .collection('users')
//   .doc('id')
//   .collection('posts')
//   .doc('id')
//   .collection('comments')
//   .where('title', '==', 'chickens')
//   .where('creator', '==', 'bob')
//   .get()
//   .then((post) => {
//
//   });

// after
// UserPostComments({ user_id: '1', post_id: '90', })
//   .findOne({
//     title: 'chickens',
//     creator: 'bob',
//     likes: {
//       $gte: 10,
//       $lte: 100,
//     }
//   })
//   .then(() => {
//
//   });

//

//
// firestore.collection('users').doc('id').collection('posts')
// firestore.doc('users/id/posts/id/comments/id').doc('id').collection('posts')
// firestore.collection('users').doc('id').collection('posts').doc('id').collection('comments').where('test', '==', 'fack u').get()
//
// User.findOne({ name: 'elliot' }).where({ age: 12 }).populate('posts');
/*
-----------------------------
User A > Assigned to Device A
        \/ ---- /\
Device A > Assigned to User A
-----------------------------

Sometime Later:
User A gets Newly assigned to
Device B:

-----------------------------
User A > Assigned to Device B
        \/ ---- /\
Device B > Assigned to User A
-----------------------------

But... Device A still believes
it belongs to User A, even though
the link has been broken:

-----------------------------
Device A > Assigned to User A
          X ---- X
User A > Assigned to Device B
-----------------------------


*/
