const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Integer Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should not throw if defaultsTo is same type', () => {
    testApp.config = {
      attributes: {
        1: {
          type: 'integer',
          defaultsTo: 0,
        },
        2: {
          type: 'integer',
          defaultsTo: -1,
        },
        3: {
          type: 'integer',
          defaultsTo: 123456789123456789,
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
          type: 'integer',
          defaultsTo: 0.0,
        },
        2: {
          type: 'integer',
          defaultsTo: '12',
        },
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
