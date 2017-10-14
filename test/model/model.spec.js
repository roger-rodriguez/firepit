const Model = require('../../src/Model');
const internals = require('../../src/internals');

const testAppName = 'ModelTestApp';
let testApp;

describe('Model', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should construct with required properties', () => {
    const model = new Model(testAppName, 'Test', { schema: false });
    model.should.have.property('appName', testAppName);
    model.should.have.property('modelName', 'Test');
    model.should.have.property('app'); // TODO firebase instance?
    model.should.have.property('schema').and.be.an.instanceOf(Object);
  });

  it('should construct without attributes if schema false', () => {
    testApp.config = {
      schema: false,
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw when constructing without attributes if schema true', () => {
    testApp.config = {
      schema: true,
    };
    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should construct with a default schema', () => {
    const name = 'Test';
    const model = new Model(testAppName, name, { schema: true, attributes: { foo: 'string' } });
    const schema = model.schema;

    schema.should.have.property('schema', true);
    schema.app.should.have.property('name', testAppName); // TODO handled by firebase instance?
    schema.should.have.property('identity', name.toLowerCase());
    schema.should.have.property('autoId', true);
    schema.should.have.property('autoCreatedAt', true);
    schema.should.have.property('autoCreatedBy', true);
    schema.should.have.property('autoUpdatedAt', true);
    schema.should.have.property('autoUpdatedBy', true);
    schema.should.have.property('collectionName', name.toLowerCase());
  });

  it('should construct with merged attributes', () => {
    testApp.config = {
      schema: false,
      identity: 'foobar',
      autoId: false,
      autoCreatedAt: false,
      autoUpdatedAt: false,
      autoCreatedBy: false,
      autoUpdatedBy: false,
      collectionName: 'foobar',
      attributes: {
        foo: {
          type: 'string',
        },
      }
    };

    const model = new Model(testAppName, 'Test');
    const schema = model.schema;

    schema.should.be.an.instanceOf(Object);
    schema.should.have.property('schema', false);
    schema.app.should.have.property('name', testAppName);
    schema.should.have.property('identity', 'foobar');
    schema.should.have.property('autoId', false);
    schema.should.have.property('autoCreatedAt', false);
    schema.should.have.property('autoCreatedBy', false);
    schema.should.have.property('autoUpdatedAt', false);
    schema.should.have.property('autoUpdatedBy', false);
    schema.should.have.property('collectionName', 'foobar');
    schema.should.have.property('attributes');
    schema.attributes.should.be.an.instanceOf(Object);
    schema.attributes.should.have.property('foo').and.be.an.instanceOf(Object);
  });

  it('should construct with default query methods', () => {
    testApp.config = {
      schema: false,
    };
    const model = new Model(testAppName, 'Test');

    model.should.have.property('findOneByField').and.be.an.instanceOf(Function);
    model.should.have.property('findOneById').and.be.an.instanceOf(Function);
    model.should.have.property('findByField').and.be.an.instanceOf(Function);
    model.should.have.property('find').and.be.an.instanceOf(Function);
    model.should.have.property('findOne').and.be.an.instanceOf(Function);
    model.should.have.property('createOrUpdate').and.be.an.instanceOf(Function);
    model.should.have.property('native').and.be.an.instanceOf(Function);
    model.should.have.property('count').and.be.an.instanceOf(Function);
    model.should.have.property('updateOne').and.be.an.instanceOf(Function);
    model.should.have.property('update').and.be.an.instanceOf(Function);
    model.should.have.property('create').and.be.an.instanceOf(Function);
    model.should.have.property('destroy').and.be.an.instanceOf(Function);
    model.should.have.property('findOrCreate').and.be.an.instanceOf(Function);
    model.should.have.property('subscribe').and.be.an.instanceOf(Function);
  });

  it('should construct with magic methods', () => {
    const model = new Model(testAppName, 'Test', {
      attributes: {
        foo: {
          type: 'string',
        },
        bar: {
          type: 'string',
        },
        fooBar: {
          type: 'string',
        },
        foo_bar: {
          type: 'string',
        },
      }
    });

    model.should.have.property('findByFoo').and.be.an.instanceOf(Function);
    model.should.have.property('findByBar').and.be.an.instanceOf(Function);
    model.should.have.property('findByFooBar').and.be.an.instanceOf(Function);
    model.should.have.property('findByFoo_bar').and.be.an.instanceOf(Function);

    model.should.have.property('findOneByFoo').and.be.an.instanceOf(Function);
    model.should.have.property('findOneByBar').and.be.an.instanceOf(Function);
    model.should.have.property('findOneByFooBar').and.be.an.instanceOf(Function);
    model.should.have.property('findOneByFoo_bar').and.be.an.instanceOf(Function);
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
