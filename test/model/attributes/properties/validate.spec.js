const Model = require('../../../../src/Model');
const internals = require('../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('Validate Attribute Property', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if not a function', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          validate: 'function',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should accept a function', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          validate() {

          },
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo value does not pass validate function', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'integer',
          defaultsTo: 1,
          validate(value) {
            if (value === 1) throw new Error('Value must not be 1');
          },
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
