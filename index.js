// // findBy X
// // findOneBy X
//
// const userDefaults = {
//   //A flag to toggle schemaless or schema mode in databases that support schemaless data structures. If turned off,
//   // this will allow you to store arbitrary data in a record. If turned on, only attributes defined in the model's attributes object will be stored.
//   schema: true, // sc
//
//   identity: 'users', // The lowercase unique key for this model, e.g. user.
//
//   app: '[DEFAULT]', // app instance
//
//   autoId: true,
//
//   autoCreatedAt: true,
//
//   autoUpdatedAt: true,
//
//   autoUpdatedBy: true, // current authed user
//
//   autoCreatedBy: true, // current authed user
//
//   collectionName: 'user',
// };
//
//
// const User = model('User', {
//   ...userDefaults,
//   attributes: {
//     name: { type: 'string' },
//     email: { type: 'email' },
//     age: { type: 'integer' },
//     noob: { type: 'boolean' },
//     posts: {
//       collection: 'posts',
//     }
//   }
// });
//
// User.findByAge(55).then((val) => {
//   debugger;
// }).catch((error) => {
//   debugger;
// });
//
// User.findByName('elliot').then((val) => {
//   debugger;
// }).catch((error) => {
//   debugger;
// });
//
// User.findOne().then((val) => {
//   debugger;
// }).catch((error) => {
//   debugger;
// });
//
// User.find({ name: 'elliot', age: 12, noob: true, }).then((val) => {
//   debugger;
// }).catch((error) => {
//   debugger;
// });
//

const Model = require('./Model');

module.exports = {
  config: function () {

  },
  model: function(name, schema) {
    return new Model(name, schema);
  },
};
