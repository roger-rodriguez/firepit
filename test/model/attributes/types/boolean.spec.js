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
        'a1': {
          type: 'boolean',
          defaultsTo: true,
        },
        'a2': {
          type: 'boolean',
          defaultsTo: false,
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo is not same type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'boolean',
          defaultsTo: 1,
        },
        'a2': {
          type: 'boolean',
          defaultsTo: 0,
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
