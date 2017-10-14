const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Object Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if defaultsTo is a json', () => {
    testApp.config = helper('object', 'json');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a null', () => {
    testApp.config = helper('object', 'null');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error

  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('object', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a object', () => {
    testApp.config = helper('object', 'object');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a float', () => {
    testApp.config = helper('object', 'float');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a string', () => {
    testApp.config = helper('object', 'string');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('object', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('object', 'boolean');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error

  });

  // TODO FAILING TEST
  // it('should throw if defaultsTo is a datetime', () => {
  //   testApp.config = helper('object', 'datetime');
  //   (function () {
  //     const model = new Model(testAppName, 'Test');
  //   }).should.throw() // TODO error
  // });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
