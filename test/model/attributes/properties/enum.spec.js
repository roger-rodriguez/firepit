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

  it('should throw if not an array', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          enum: {},
        },
        'a2': {
          type: 'string',
          enum: '123',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
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
          enum: [],
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should accept primitive types if attribute type is any', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'any',
          enum: [1, '2', true, null],
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if attribute type is any but a value is not of primitive type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'any',
          enum: [{ foo: 'bar ' }],
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if enum value is not of attribute type', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          enum: ['1', 2],
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo value is not an enum value', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          defaultsTo: 'foobar',
          enum: ['1', '2'],
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo value is an enum value', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          defaultsTo: 'foobar',
          enum: ['1', '2', 'foobar'],
        },
      }
    };

    const model = new Model(testAppName, 'Test');

  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
