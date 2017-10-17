let firebase = null;

const model = 'Test_Schema';

describe('limit', () => {

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

  it('should array of documents equal to length of limit', () => {
    const User = firebase.firepit().model(model);

    return User.find().limit(1)
      .then((documents) => {
        documents.should.be.instanceOf(Array);
        documents.should.have.length(1);
      });
  });

  it('should return all documents when limit is 0', () => {
    const User = firebase.firepit().model(model);

    let total = null;

    return User.find()
      .then((documents) => {
        total = documents.length;
        return User.find().limit(0);
      })
      .then((documents) => {
        if (documents.length !== total) {
          throw new Error('Total documents does not match up');
        }

        return Promise.resolve();
      });
  });


  it('should throw if called on a findOne method', () => {
    const User = firebase.firepit().model(model);

    (() => {
      User.findOne('abc').limit(1)
    }).should.throw();
  });

});
