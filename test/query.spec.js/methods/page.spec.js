const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query page method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if parameter is not of type integer', () => {
    (() => {
      const query = new Query(modelInstance, {}).page('foobar');
    }).should.throw(); // todo
  });

  it('should throw if parameter less than 0', () => {
    (() => {
      const query = new Query(modelInstance, {}).page(-1);
    }).should.throw(); // todo
  });

  it('should set internal property', () => {
    const query = new Query(modelInstance, {}).page(123);

    query.should.have.property('_page', 123);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
