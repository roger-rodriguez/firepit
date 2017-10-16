const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query where method', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if parameter is not of type Object', () => {
    (() => {
      const query = new Query(modelInstance, {}).where('foobar');
    }).should.throw(); // todo
  });

  it('should set internal criteria parameter', () => {
    const query = new Query(modelInstance, {}).where({
      foo: 'bar',
    });

    query.should.have.property('_criteria').and.be.instanceOf(Object);
    query._criteria.should.have.property('foo', 'bar');
  });

  it('should merge with initial criteria set internal criteria parameter', () => {
    const query = new Query(modelInstance, {
      foo: 'bar',
      bar: 'baz',
    })
    .where({
      foo: '123',
    });

    query.should.have.property('_criteria').and.be.instanceOf(Object);
    query._criteria.should.have.property('foo', '123');
    query._criteria.should.have.property('bar', 'baz');
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
