const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Any Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should not throw if defaultsTo is a json', () => {
    testApp.config = helper('any', 'json');
    const model = new Model(testAppName, 'Test');
  });

  it('should not throw if defaultsTo is a null', () => {
    testApp.config = helper('any', 'null');
    const model = new Model(testAppName, 'Test');
  });

  it('should not not throw if defaultsTo is a array', () => {
    testApp.config = helper('any', 'array');
    const model = new Model(testAppName, 'Test');
  });

  it('should not throw if defaultsTo is a object', () => {
    testApp.config = helper('any', 'object');
    const model = new Model(testAppName, 'Test');
  });

  it('should not throw if defaultsTo is a float', () => {
    testApp.config = helper('any', 'float');
    const model = new Model(testAppName, 'Test');
  });

  it('should not throw if defaultsTo is a string', () => {
    testApp.config = helper('any', 'string');
    const model = new Model(testAppName, 'Test');
  });

  it('should not throw if defaultsTo is a integer', () => {
    testApp.config = helper('any', 'integer');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a boolean', () => {
    testApp.config = helper('any', 'boolean');
    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is a datetime', () => {
    testApp.config = helper('any', 'datetime');
    const model = new Model(testAppName, 'Test');
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
