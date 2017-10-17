let firebase = null;

const model = 'Test_Schema';

describe('findOne', () => {

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

  it('TODO should return a document when no arguments given', () => {
    // todo
    // const User = firebase.firepit().model(model);
    //
    // return User.findOne()
    //   .then((document) => {
    //     documents.should.be.instanceOf(Object);
    //     document.should.have.property('id');
    //   });
  });

  it('should throw when parameter is not string or Object', () => {
    const User = firebase.firepit().model(model);

    (() => {
      User.findOne(['a']);
    }).should.throw();
  });

  it('should return a specific document when string ID is given', () => {
    const User = firebase.firepit().model(model);

    return User.findOne('vmRrXnwNXBUmmo0RsbN7')
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('id', 'vmRrXnwNXBUmmo0RsbN7');
      });
  });

  it('TODO should return a specific document when invalid string ID is given', () => {
    // todo
    // const User = firebase.firepit().model(model);
    //
    // return User.findOne('foobar')
    //   .then((document) => {
    //     document.should.be.null();
    //   });
  });

  it('should return a specific document when passing criteria', () => {
    const User = firebase.firepit().model(model);

    return User
      .findOne({
        name: 'foobar',
      })
      .then((document) => {
        document.should.be.instanceOf(Object);
        document.should.have.property('name', 'foobar');
      });
  });

});
