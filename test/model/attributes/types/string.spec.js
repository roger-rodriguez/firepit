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
        1: {
          type: 'string',
          defaultsTo: 'foobar',
        },
        2: {
          type: 'string',
          defaultsTo: "foobarbaz",
        },
      }
    };

    const model = new Model(testAppName, 'Test');
    model.validateSchema();
  });

  it('should throw if defaultsTo is not same type', () => {
    testApp.config = {
      attributes: {
        1: {
          type: 'string',
          defaultsTo: 123,
        }
      }
    };

    const model = new Model(testAppName, 'Test');

    (function () {
      model.validateSchema();
    }).should.throw() // TODO error
  });

  afterEach(() => {
    delete internals.apps[testAppName];
  });

});
