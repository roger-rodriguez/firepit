const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Boolean Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should not throw if defaultsTo is same type', () => {
    testApp.config = {
      attributes: {
        1: {
          type: 'boolean',
          defaultsTo: true,
        },
        2: {
          type: 'boolean',
          defaultsTo: false,
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
          type: 'boolean',
          defaultsTo: 1,
        },
        2: {
          type: 'boolean',
          defaultsTo: 0,
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
