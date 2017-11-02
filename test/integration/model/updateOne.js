let firebase = null;

const model = 'Test_Schema';
let idToUpdate = null;
const original = { name: 'foobar', age: 123, deep: { foo: 'bar' } };

describe('updateOne', () => {

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
      .updateOne(123, {
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

  it('should throw when document is not of type Object', () => {
    const User = firebase.firepit().model(model);

    return User
      .updateOne(123, 456)
      .then(() => {
        throw new Error('Document should not have updated');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should throw if document contains an ID field', () => {
    const User = firebase.firepit().model(model);

    return User
      .updateOne(123, {
        id: '123',
      })
      .then(() => {
        throw new Error('Document should not have updated');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should update a single document and return it', () => {
    const User = firebase.firepit().model(model);

    const name = `${Math.random().toString(32)}`;

    return User
      .updateOne(idToUpdate, {
        name,
      })
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('name', name);
        return User.updateOne(idToUpdate, original);
      });
  });

  it('should update a deep nested value', () => {
    const User = firebase.firepit().model(model);

    return User
      .updateOne(idToUpdate, {
        deep: {
          foo: 'baz',
        }
      })
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('deep').and.be.instanceOf(Object);
        document.deep.should.have.property('foo', 'baz');
        return User.updateOne(idToUpdate, original);
      });
  });

  it('TODO should update updatedAt value', () => {
    // const User = firebase.firepit().model(model);
    //
    // let timestamp = null;
    //
    // return User.findOneById(idToUpdate)
    //   .then((document) => {
    //     timestamp = document.updatedAt.toString();
    //     return User.updateOne(idToUpdate, {
    //       name: 'foobarbaz',
    //     });
    //   })
    //   .then((updated) => {
    //     if (updated.updatedAt.toString() === timestamp) {
    //       throw new Error('updatedAt value did not update');
    //     }
    //     return Promise.resolve();
    //   });
  });

});
