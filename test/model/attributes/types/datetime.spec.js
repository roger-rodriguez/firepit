const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('DateTime Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if defaultsTo is a json', () => {
    testApp.config = helper('datetime', 'json');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a null', () => {
    testApp.config = helper('datetime', 'null');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('datetime', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a object', () => {
    testApp.config = helper('datetime', 'object');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a float', () => {
    testApp.config = helper('datetime', 'float');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a string', () => {
    testApp.config = helper('datetime', 'string');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('datetime', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('datetime', 'boolean');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a datetime', () => {
    testApp.config = helper('datetime', 'datetime');
    const model = new Model(testAppName, 'Test');
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
