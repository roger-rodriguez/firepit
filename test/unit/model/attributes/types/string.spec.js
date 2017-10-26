const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('String Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  // TODO What to do about this? Json is still a string
  // it('should throw if defaultsTo is a json', () => {
  //   testApp.config = helper('string', 'json');
  //   (function () {
  //     const model = new Model(testAppName, 'Test');
  //   }).should.throw() // TODO error
  // });

  it('should throw if defaultsTo is a null', () => {
    testApp.config = helper('string', 'null');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('string', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a object', () => {
    testApp.config = helper('string', 'object');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a float', () => {
    testApp.config = helper('string', 'float');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a string', () => {
    testApp.config = helper('string', 'string');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('string', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error

  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('string', 'boolean');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a datetime', () => {
    testApp.config = helper('string', 'datetime');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
