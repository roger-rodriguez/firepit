const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query limit method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if parameter is not of type integer', () => {
    (() => {
      const query = new Query(modelInstance, {}).limit('foobar');
    }).should.throw(); // todo
  });

  it('should throw if parameter less than 0', () => {
    (() => {
      const query = new Query(modelInstance, {}).limit(-1);
    }).should.throw(); // todo
  });

  it('should set internal property', () => {
    const query = new Query(modelInstance, {}).limit(123);

    query.should.have.property('_limit', 123);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
