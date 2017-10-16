const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query select method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if parameter is not of type array', () => {
    (() => {
      const query = new Query(modelInstance, {}).select('foobar');
    }).should.throw(); // todo
  });

  it('should throw if parameter not array of type strings', () => {
    (() => {
      const query = new Query(modelInstance, {}).select(['foo', 123]);
    }).should.throw(); // todo
  });

  it('should set internal property', () => {
    const select = ['foo', 'bar'];
    const query = new Query(modelInstance, {}).select(select);

    query.should.have.property('_select', select);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
