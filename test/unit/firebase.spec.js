const firebase = require("firebase-admin");
const firepit = require('../../src');
const serviceAccount = require('../../firepit.json');

describe('firebase module', () => {

  before(() => {
    if (firebase.apps.length === 0) {
      firepit.use(firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: "https://firepit-tests.firebaseio.com"
      }));
    }
  });

  it('should extend app with firepit module', () => {
    firebase.should.have.property('firepit').and.be.instanceOf(Function);
  });

  it('should provide module methods', () => {
    const firepit = firebase.firepit();

    firepit.should.have.property('createModel').and.be.instanceOf(Function);
    firepit.should.have.property('model').and.be.instanceOf(Function);
    firepit.should.have.property('initialize').and.be.instanceOf(Function);
  });

});
