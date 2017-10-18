const Model = require('../../src/Model');

let firebase = null;

const model = 'Test_Schema';

describe('Enumerable', () => {

  before(() => {
    firebase = require('./app')().firebase;

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

  it('a single document should provide enumerable properties', () => {
    const User = firebase.firepit().model(model);

    return User.findOne('vmRrXnwNXBUmmo0RsbN7')
      .then((document) => {
        document.should.have.property('save').and.be.instanceOf(Function);
        document.should.have.property('destroy').and.be.instanceOf(Function);
        document.should.have.property('model').and.be.instanceOf(Model);
        document.should.have.property('ref').and.be.instanceOf(Object); // TODO instanceOf(DocumentReference)?
      });
  });

  it('multiple documents should provide enumerable properties', () => {
    const User = firebase.firepit().model(model);

    return User.find()
      .then((documents) => {
        documents.should.have.property('empty').and.be.instanceOf(Boolean);
        documents.should.have.property('query').and.be.instanceOf(Object); // TODO instanceOf(Query)??
        documents.should.have.property('changes').and.be.instanceOf(Array);
      });
  });

});
