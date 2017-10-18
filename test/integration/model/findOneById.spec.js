let firebase = null;

const model = 'Test_Schema';

describe('findOneById', () => {

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

  it('should throw when no argument given', () => {
    const User = firebase.firepit().model(model);

    (() => {
      User.findOneById();
    }).should.throw();
  });

  it('should throw when argument is not of type string', () => {
    const User = firebase.firepit().model(model);

    (() => {
      User.findOneById({ id: '123' });
    }).should.throw();
  });

  it('should return a specific document of the same ID', () => {
    const User = firebase.firepit().model(model);

    return User.findOneById('vmRrXnwNXBUmmo0RsbN7')
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('id', 'vmRrXnwNXBUmmo0RsbN7');
      })
  });

  it('should return null when no documents have given ID', () => {
    const User = firebase.firepit().model(model);

    return User.findOneById('qwertyuiop')
      .then((document) => {
        if (document !== null) {
          throw new (`Expected document to be null but got ${typeof document}`);
        }
      });
  });

});
