let firebase = null;

const model = 'Test_Schema';

describe('sort', () => {

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

  it('should return an array of documents in sorted order with string value', () => {
    const User = firebase.firepit().model(model);

    return User.find().sort('age', 'desc')
      .then((documents) => {
        documents.should.be.instanceOf(Array);

        let val = documents[0].age;

        documents.forEach((document) => {
          if (document.age > val) {
            throw new Error('Results not in descending order');
          }
          val = document.age;
        });
      });
  });

  it('should return an array of documents in sorted order with object value', () => {
    const User = firebase.firepit().model(model);

    return User.find()
      .sort({
        age: 'asc',
      })
      .then((documents) => {
        documents.should.be.instanceOf(Array);

        let val = documents[0].age;

        documents.forEach((document) => {
          if (document.age < val) {
            throw new Error('Results not in ascending order');
          }
          val = document.age;
        });
      });
  });

});
