const firebase = require("firebase-admin");
const firepit = require('../../src');
const serviceAccount = require('../../firepit.json');

const deleteInstance = firepit.deleteInstance;

const app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://firepit-tests.firebaseio.com"
});

module.exports = function (appName = '[DEFAULT]') {
  deleteInstance(appName);

  firepit.use(app);

  return {
    firebase,
    firepit: firebase.firepit(),
  };
};

