const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Float Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if defaultsTo is a json', () => {
    testApp.config = helper('float', 'json');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a null', () => {
    testApp.config = helper('float', 'null');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('float', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a object', () => {
    testApp.config = helper('float', 'object');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a float', () => {
    testApp.config = helper('float', 'float');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a string', () => {
    testApp.config = helper('float', 'string');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('float', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('float', 'boolean');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a datetime', () => {
    testApp.config = helper('float', 'datetime');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
