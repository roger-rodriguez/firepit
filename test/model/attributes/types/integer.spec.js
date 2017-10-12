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
        'a1': {
          type: 'integer',
          defaultsTo: 0,
        },
        'a2': {
          type: 'integer',
          defaultsTo: -1,
        },
        'a3': {
          type: 'integer',
          defaultsTo: 123456789123456789,
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is not same type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'integer',
          defaultsTo: 0.0,
        },
        'a2': {
          type: 'integer',
          defaultsTo: '12',
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
