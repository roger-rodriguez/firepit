const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Boolean Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if defaultsTo is a json', () => {
    testApp.config = helper('boolean', 'json');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a null', () => {
    testApp.config = helper('boolean', 'null');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a array', () => {
    testApp.config = helper('boolean', 'array');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a object', () => {
    testApp.config = helper('boolean', 'object');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a float', () => {
    testApp.config = helper('boolean', 'float');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a string', () => {
    testApp.config = helper('boolean', 'string');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo is a integer', () => {
    testApp.config = helper('boolean', 'integer');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo is a boolean', () => {
    testApp.config = helper('boolean', 'boolean');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a datetime', () => {
    testApp.config = helper('boolean', 'datetime');
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
