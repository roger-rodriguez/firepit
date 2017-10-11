const Model = require('../Model');

describe('Model', () => {

  it('should construct with a name', () => {
    const model = Model.create('Test');
    model.should.have.property('name', 'Test');
  });

  it('should construct with a default schema', () => {
    const model = Model.create('Test');
    model.should.have.property('schema').and.should.be.an.instanceOf(Object);
    model.schema.should.have.property('schema', true);
    model.schema.should.have.property('identity', 'test');
    model.schema.should.have.property('autoId', true);
    model.schema.should.have.property('autoCreatedAt', true);
    model.schema.should.have.property('autoCreatedBy', true);
    model.schema.should.have.property('autoUpdatedAt', true);
    model.schema.should.have.property('autoUpdatedBy', true);
    model.schema.should.have.property('collectionName', 'test');
    model.schema.should.have.property('attributes');
    model.schema.attributes.should.be.an.instanceOf(Object);
  });

  it('should construct with merged attributes', () => {
    const model = Model.create('Test', {
      schema: false,
      identity: 'foobar',
      autoId: false,
      autoCreatedAt: false,
      autoUpdatedAt: false,
      autoCreatedBy: false,
      autoUpdatedBy: false,
      collectionName: 'foobar',
      attributes: {
        foo: 'bar',
      }
    });

    model.should.have.property('schema');
    model.schema.should.be.an.instanceOf(Object);
    model.schema.should.have.property('schema', false);
    model.schema.should.have.property('identity', 'foobar');
    model.schema.should.have.property('autoId', false);
    model.schema.should.have.property('autoCreatedAt', false);
    model.schema.should.have.property('autoCreatedBy', false);
    model.schema.should.have.property('autoUpdatedAt', false);
    model.schema.should.have.property('autoUpdatedBy', false);
    model.schema.should.have.property('collectionName', 'foobar');
    model.schema.should.have.property('attributes');
    model.schema.attributes.should.be.an.instanceOf(Object);
    model.schema.attributes.should.have.property('foo', 'bar'); // TODO deep merge?
  });


  it('should construct with magic methods', () => {
    const model = Model.create('Test', {
      attributes: {
        foo: null,
        bar: null,
        fooBar: null,
        foo_bar: null,
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


  it('should construct with default query methods', () => {
    const model = Model.create('Test');

    model.should.have.property('findOneByField').and.be.an.instanceOf(Function);
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

  it('should construct with lifecycle methods', () => {
    // TODO
    return Promise.resolve();
  });

  // Move to attributes tests
  it('should accept valid attributes', () => {
    // TODO
  });

});
