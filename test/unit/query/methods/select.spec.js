const Model = require('../../../../src/Model');
const Query = require('../../../../src/Query');
const internals = require('../../../../src/internals');

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
    let query = new Query(modelInstance, {});
    query.should.have.property('_select').and.be.null();
    query = query.select(select);
    query.should.have.property('_select').and.be.instanceOf(Object);
    query._select.should.have.property('foo', true);
    query._select.should.have.property('bar', true);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
