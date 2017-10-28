let firebase = null;

const model = 'Test_Schema';

describe('destroy', () => {

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
        }
      },
    });
  });

  it('should throw if object and ID is passed', () => {
    const User = firebase.firepit().model(model);

    return User
      .destroy({
        id: '123',
      })
      .then(() => {
        throw new Error('Document should not have been destroyed');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should throw if array containing non-string is passed', () => {
    const User = firebase.firepit().model(model);

    return User
      .destroy(['123', 456])
      .then(() => {
        throw new Error('Document should not have been destroyed');
      })
      .catch(() => {
        // todo error
        return Promise.resolve();
      });
  });

  it('should destroy array of string documents', () => {
    const User = firebase.firepit().model(model);

    let id = null;

    return User
      .create({
        name: 'foobar',
        age: 123
      })
      .then((created) => {
        id = created.id;
        return User.destroy([id]);
      })
      .then(() => User.findOneById(id))
      .then((document) => {
        if (document !== null) throw new Error('Document returned after it should have been destroyed');
      });
  });

  it('should destroy documents by query', () => {
    const User = firebase.firepit().model(model);

    let id = null;

    const toDestroy = {
      name: `${Math.random().toString(32)}`,
      age: 123,
    };

    return User
      .create(toDestroy)
      .then((created) => {
        id = created.id;
        return User.destroy(toDestroy);
      })
      .then(() => User.findOneById(id))
      .then((document) => {
        if (document !== null) throw new Error('Document returned after it should have been destroyed');
      });
  });

  it('should destroy documents by id', () => {
    const User = firebase.firepit().model(model);
    let id = null;

    const toDestroy = {
      name: `${Math.random().toString(32)}`,
      age: 123,
    };

    return User
      .create(toDestroy)
      .then((created) => {
        id = created.id;
        return User.destroy(id);
      })
      .then(() => User.findOneById(id))
      .then((document) => {
        if (document !== null) throw new Error('Document returned after it should have been destroyed');
      });
  });


});
