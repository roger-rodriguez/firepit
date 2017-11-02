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
      via: 'created_by',
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
    created_by: {
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

Post.findOneById('DuJrCe3pOgjiqk8uIpTd')
  .populate('created_by')
  .then((res) => {
    debugger;
  })
  .catch((e) => {
    debugger;
  })


Post.create({
  user: 'xyz'
})
