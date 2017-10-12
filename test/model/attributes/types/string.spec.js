const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('String Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should not throw if defaultsTo is same type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          defaultsTo: 'foobar',
        },
        'a2': {
          type: 'string',
          defaultsTo: "foobarbaz",
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is not same type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          defaultsTo: 123,
        }
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
