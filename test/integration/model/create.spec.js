const { generateDocumentId } = require('../../../src/utils');
let firebase = null;

const model = 'Test_Schema';

function setSchemaProp(cl, prop, val) {
  cl.schema._schema[prop] = val;
}

describe('create', () => {

  before(() => {
    firebase = require('../app')().firebase;

    firebase.firepit().createModel(model, {
      attributes: {
        name: {
          type: 'string',
          required: true,
        },
        age: {
          type: 'integer',
          required: true,
        },
      },
    });
  });

  it('should create and return the new document', () => {
    const User = firebase.firepit().model(model);
    setSchemaProp(User, 'autoId', true);
    const randAge = Math.floor(Math.random() * 1000000) + 1;

    return User
      .create({
        name: 'foobar',
        age: randAge,
      })
      .then((created) => {
        created.should.be.instanceOf(Object);
        created.should.have.property('name', 'foobar');
        created.should.have.property('age', randAge);
        created.should.have.property('createdAt');
        created.should.have.property('createdBy');
        created.should.have.property('updatedAt');
        created.should.have.property('updatedBy');
      });
  });

  it('should throw if ID is passed with data', () => {
    const User = firebase.firepit().model(model);
    setSchemaProp(User, 'autoId', true);

      return User
        .create({
          id: '123',
          name: 'foobar',
          age: 10,
        })
        .then(() => {
          throw new Error('Document created but ID should have auto-generated');
        })
        .catch(() => {
          // todo error
          return Promise.resolve();
        });
  });

  it('should throw if no ID is passed and autoId is false', () => {
    const User = firebase.firepit().model(model);
    setSchemaProp(User, 'autoId', false);

      return User
        .create({
          name: 'foobar',
          age: 10,
        })
        .then(() => {
          throw new Error('Document created but an ID was required');
        })
        .catch(() => {
          // todo error
          return Promise.resolve();
        });
  });

  it('should use custom ID if autoId is false', () => {
    const User = firebase.firepit().model(model);
    setSchemaProp(User, 'autoId', false);

    const id = generateDocumentId();

    return User
      .create({
        id,
        name: 'foobar',
        age: 10,
      })
      .then((document) => {
        document.should.have.property('id', id);
      });
  });

  it('should throw when creating a document with an existing ID', () => {
    const User = firebase.firepit().model(model);
    setSchemaProp(User, 'autoId', false);

    const id = generateDocumentId();

    return User
      .create({
        id,
        name: 'foobar',
        age: 10,
      })
      .then(() => {
        return User.create({
          id,
          name: 'foobar',
          age: 10,
        });
      })
      .then(() => {
        throw new Error('Document re-created with the same ID');
      })
      .catch((error) => {
        // if (error.message.includes('')) // todo
        return Promise.resolve();
      });
  });

});
