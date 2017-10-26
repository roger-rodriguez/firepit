const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Required Attribute Property', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should accept a boolean value', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          required: false,
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should show on none boolean value', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          required: 'true',
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
