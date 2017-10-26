const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');
const helper = require('./helper');

const testAppName = 'TestApp';
let testApp;

describe('Integer Type Attributes', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if type is a invalid', () => {
    testApp.config = {
      attributes: {
        a1: {
          type: 'foobar',
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
