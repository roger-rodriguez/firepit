const Model = require('../../../../src/Model');
const Query = require('../../../../src/Query');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query populate method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if parameter is not of type string', () => {
    (() => {
      const query = new Query(modelInstance, {}).populate(123);
    }).should.throw(); // todo
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
