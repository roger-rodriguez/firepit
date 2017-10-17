const Model = require('../../src/Model');

let firebase = null;

describe('firepit', () => {

  before(() => {
    firebase = require('./app')().firebase;
  });

  it('should create a model and return it', () => {
    const model = firebase.firepit().createModel('Test', {
      schema: false,
    });

    model.should.be.instanceOf(Model);
  });

  it('should return a model by name', () => {
    firebase.firepit().createModel('Testing', {
      schema: false,
    });

    const model = firebase.firepit().model('Testing');
    model.should.be.instanceOf(Model);
  });

});
