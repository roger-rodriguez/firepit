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

firebase.firepit().createModel('User', {
  schema: true,
  attributes: {
    name: {
      type: 'string',
    },

    // one to many - virtual field
    posts: {
      hasMany: 'post',
      via: 'creator',
    },

    // one to one - actual field
    vehicle: {
      hasOne: 'vehicle',
      via: 'owner',
    },

    // one way assoc - actual field
    first_post: {
      hasOne: 'post',
    },

    // many to many - virtual field - via join table
    liked_posts: {
      hasMany: 'post',
      via: 'likes'
    },
  },
});

firebase.firepit().createModel('Vehicle', {
  schema: true,
  attributes: {
    make: 'string',

    // one to one - actual field
    owner: {
      hasOne: 'user',
      via: 'vehicle',
    },
  },
});

firebase.firepit().createModel('Post', {
  schema: true,
  attributes: {
    title: 'string',

    // one to many - actual field
    creator: {
      hasOne: 'user',
    },


    // many to many - virtual field - via join table
    likes: {
      hasMany: 'user',
      via: 'liked_posts'
    }
  },
});

firebase.firepit().initialize();
const User = firebase.firepit().model('User');
const Post = firebase.firepit().model('Post');
const Vehicle = firebase.firepit().model('Vehicle');

// Vehicle.create({
//   make: 'Pony',
// })
// todo findOne with no id should return limit(1) query
console.time('hazzah');
User.findOne('NIWoMm4pqAILtnIWXnQz')
  .populate('first_post')
  .populate('vehicle')
  .populate('posts')
  .populate('liked_posts', {
    where: {},
    limit: 10,
    page: 10
  })
  .then((res) => {
    console.timeEnd('hazzah');

    console.log(JSON.stringify(res, null, 4));
    debugger;
  })
  .catch((e) => {
    console.error(e)
    debugger;
  });


setTimeout(() => {
  console.time('hazzah2');
  User.findOne('NIWoMm4pqAILtnIWXnQz')
    .populate('first_post')
    .populate('vehicle')
    .populate('posts')
    .populate('liked_posts', {
      where: {},
      limit: 10,
      page: 10
    })
    .then((res) => {
      console.timeEnd('hazzah2');

      console.log(JSON.stringify(res, null, 4));
      debugger;
    })
    .catch((e) => {
      console.error(e)
      debugger;
    });

}, 5000);
