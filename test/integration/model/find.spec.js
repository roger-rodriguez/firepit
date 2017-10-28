let firebase = null;

const model = 'Test_Schema';

describe('find', () => {

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

  it('should return all documents as an array of objects when no parameters given', () => {
    const User = firebase.firepit().model(model);

    return User.find()
      .then((documents) => {
        documents.should.be.instanceOf(Array);
        documents.forEach((document) => {
          document.should.be.instanceOf(Object);
          document.should.have.property('id');
          document.should.have.property('name');
          document.should.have.property('age');
        });
      });
  });

  it('should throw when parameter is not an Object', () => {
    const User = firebase.firepit().model(model);

    (() => {
      User.find(['a']);
    }).should.throw();
  });

  it('should return an array of documents of criteria', () => {
    const User = firebase.firepit().model(model);

    return User
      .find({
        name: 'foobar',
      })
      .then((documents) => {
        documents.should.be.instanceOf(Array);
        documents.forEach((document) => {
          document.should.be.instanceOf(Object);
          document.should.have.property('id');
          document.should.have.property('name', 'foobar');
        });
      });
  });

  it('should return an empty array when no matching criteria', () => {
    const User = firebase.firepit().model(model);

    return User
      .find({
        name: 'qwertyuiop',
      })
      .then((documents) => {
        documents.should.be.instanceOf(Array);
        documents.should.be.empty();
      });
  });

});
