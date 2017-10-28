let firebase = null;

const model = 'Test_Schema';

describe('count', () => {

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

  it('should return an integer', () => {
    const User = firebase.firepit().model(model);

    return User.count()
      .then((value) => {
        value.should.be.instanceOf(Number);
        value.should.be.above(0);
      });
  });

});
