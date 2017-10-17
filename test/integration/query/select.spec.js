let firebase = null;

const model = 'Test_Schema';

describe('select', () => {

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

  it('should only return selected fields', () => {
    const User = firebase.firepit().model(model);

    return User.find().select(['age'])
      .then((documents) => {
        documents.should.be.instanceOf(Array);

        documents.forEach((document) => {
          document.should.have.property('id');
          document.should.have.property('age');
          document.should.not.have.property('name');
        });
      });
  });

});
