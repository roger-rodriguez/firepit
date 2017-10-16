const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query findOne method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should set internal flag to true when called', () => {
    const query = new Query(modelInstance, {}).isFindOne('foobar');
    query.should.have.property('_isFindOne', true);
    query.should.have.property('_limit', 1);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
