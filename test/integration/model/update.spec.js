let firebase = null;

const model = 'Test_Schema';
let idToUpdate = null;
const original = { name: 'foobar', age: 123, deep: { foo: 'bar' } };

describe('update', () => {

  before((done) => {
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
        deep: {
          type: 'object',
          required: true,
        }
      },
    });

    const Model = firebase.firepit().model(model);
    Model.create(original)
      .then((document) => {
        idToUpdate = document.id;
        done();
      })
      .catch(done);
  });

  it('should throw when invalid ID is passed', () => {
    const User = firebase.firepit().model(model);

    return User
      .update(123, {
        name: 'foobar2',
        age: 123,
      })
      .then(() => {
        throw new Error('Document should not have updated');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should throw when document is not valid', () => {
    const User = firebase.firepit().model(model);

    return User
      .update(123, 456)
      .then(() => {
        throw new Error('Document should not have updated');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should update a multiple documents by criteria', () => {
    const User = firebase.firepit().model(model);

    const name = `${Math.random().toString(32)}`;

    return User
      .update(original, {
        name,
      })
      .then(() => {
        return User.findOneById(idToUpdate);
      })
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('name', name);
        return User.updateOne(idToUpdate, original);
      });
  });

});
