const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Field Name Attribute Property', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should attach key name as fieldName if not provided', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
        },
      }
    };

    const model = new Model(testAppName, 'Test');
    model.schema._schema.attributes.a1.should.have.property('fieldName', 'a1');
  });

  it('should use fieldName attribute if not of type string', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          fieldName: {},
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if fieldName attribute is not a valid Cloud Firestore key', () => {
    testApp.config = {
      attributes: {
        '123abc': {
          type: 'string',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
