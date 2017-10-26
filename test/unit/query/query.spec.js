const Model = require('../../../src/Model');
const Query = require('../../../src/Query');
const internals = require('../../../src/internals');

const testAppName = 'TestApp';
let testApp;
let modelInstance;

describe('Query', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
    modelInstance = new Model(testAppName, 'Test', { schema: false });
  });

  it('should throw if no criteria is provided construct with empty criteria', () => {
    (() => {
      const query = new Query(modelInstance);
    }).should.throw(); // todo
  });

  it('should construct with methods', () => {
    const query = new Query(modelInstance, {});

    // methods
    query.should.have.property('isFindOne').and.be.instanceOf(Function);
    query.should.have.property('select').and.be.instanceOf(Function);
    query.should.have.property('limit').and.be.instanceOf(Function);
    query.should.have.property('where').and.be.instanceOf(Function);
    query.should.have.property('sort').and.be.instanceOf(Function);
    query.should.have.property('then').and.be.instanceOf(Function);
    query.should.have.property('catch').and.be.instanceOf(Function);
  });

  it('should construct with object criteria', () => {
    const query = new Query(modelInstance, {
      foo: 'bar',
    });
    query.should.have.property('_select', null);
    query.should.have.property('_page', 1);
    query.should.have.property('_sort', null);
    query.should.have.property('_docId', null);
    query.should.have.property('_model', modelInstance);
    query.should.have.property('_reject', null);
    query.should.have.property('_resolve', null);
    query.should.have.property('_promise', null);
    query.should.have.property('_criteria').and.be.an.instanceOf(Object);
    query.criteria.should.have.property('foo', 'bar');
    query.should.have.property('_isFindOne', false);
    query.should.have.property('_limit', modelInstance.schema.limit);
  });

  it('should construct with string criteria', () => {
    const query = new Query(modelInstance, 'foobar');
    query.should.have.property('_page', 1);
    query.should.have.property('_sort', null);
    query.should.have.property('_docId', 'foobar');
    query.should.have.property('_model', modelInstance);
    query.should.have.property('_reject', null);
    query.should.have.property('_resolve', null);
    query.should.have.property('_promise', null);
    query.should.have.property('_criteria', null);
    query.should.have.property('_isFindOne', false);
    query.should.have.property('_limit', modelInstance.schema.limit);
  });

  it('should throw if possibleValue is provided but criteria is not a string', () => {
    (() => {
      const query = new Query(modelInstance, {}, 'foobar');
    }).should.throw(); // todo
  });

  it('should construct with string criteria and possibleValue', () => {
    const query = new Query(modelInstance, 'foobar', 'barbaz');
    query.should.have.property('_page', 1);
    query.should.have.property('_sort', null);
    query.should.have.property('_docId', null);
    query.should.have.property('_model', modelInstance);
    query.should.have.property('_reject', null);
    query.should.have.property('_resolve', null);
    query.should.have.property('_promise', null);
    query.should.have.property('_criteria').and.be.an.instanceOf(Object);
    query._criteria.should.have.property('foobar', 'barbaz');
    query.should.have.property('_isFindOne', false);
    query.should.have.property('_limit', modelInstance.schema.limit);
  });

  it('TODO should throw is field and value do not match declared attribute type', () => {
    // TODO
  });

  it('should construct and return flat criteria object ', () => {
    const query = new Query(modelInstance, 'foobar');
    query.should.have.property('_page', 1);
    query.should.have.property('_sort', null);
    query.should.have.property('_docId', 'foobar');
    query.should.have.property('_model', modelInstance);
    query.should.have.property('_reject', null);
    query.should.have.property('_resolve', null);
    query.should.have.property('_promise', null);
    query.should.have.property('_criteria', null);
    query.should.have.property('_isFindOne', false);
    query.should.have.property('_limit', modelInstance.schema.limit);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
