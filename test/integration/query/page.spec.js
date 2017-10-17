let firebase = null;

const model = 'Test_Schema';

describe('page', () => {

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

  it('should page the results with a given limit', () => {
    const User = firebase.firepit().model(model);

    let pageId = null;

    return User.find().limit(1).page(1)
      .then((documents) => {
        pageId = documents[0].id;
        return User.find().limit(1).page(2);
      })
      .then((documents) => {
        if (pageId === documents[0].id) {
          throw new Error('Document has not changed on page change');
        }

        return Promise.resolve();
      });
  });

});
