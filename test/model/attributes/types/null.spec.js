const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Null Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if defaultsTo is a json', () => {
    testApp.config = helper('null', 'json');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a null', () => {
    testApp.config = helper('null', 'null');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('null', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a object', () => {
    testApp.config = helper('null', 'object');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a float', () => {
    testApp.config = helper('null', 'float');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a string', () => {
    testApp.config = helper('null', 'string');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('null', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('null', 'boolean');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error

  });

  it('should throw if defaultsTo is a datetime', () => {
    testApp.config = helper('null', 'datetime');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
