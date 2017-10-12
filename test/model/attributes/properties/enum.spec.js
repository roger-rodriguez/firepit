const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Enum Attribute Property', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should accept an array with length', () => {
    testApp.config = {
      attributes: {
       'a1': {
          type: 'string',
          enum: ['1'],
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw is array length is empty', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          enum: ['1'],
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
