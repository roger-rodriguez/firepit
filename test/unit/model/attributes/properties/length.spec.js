const Model = require('../../../../../src/Model');
const internals = require('../../../../../src/internals');

const testAppName = 'TestApp';
let testApp;

describe('minLength/maxLength Attribute Property', () => {

  beforeEach(() => {
    testApp = internals.createInstance({
      name: testAppName,
    });
  });

  it('should throw if minLength is provided but attribute type is not string', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'boolean',
          minLength: 123,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if maxLength is provided but attribute type is not string', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'boolean',
          maxLength: 123,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if length is provided and attribute type is string', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: 123,
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if minLength is provided but value is not of type integer', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: '123',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if maxLength is provided but value is not of type integer', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: true,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if minLength less than 0', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: -1,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if maxLength less than 0', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: -1,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });


  it('should throw if minLength is equal to or greater than maxLength', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: 5,
          maxLength: 5,
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if minLength is less than maxLength', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: 4,
          maxLength: 5,
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  it('should throw if defaultsTo value is less than minLength', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: 4,
          defaultsTo: 'abc',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should throw if defaultsTo value is greater than minLength', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          maxLength: 4,
          defaultsTo: 'abcde',
        },
      }
    };

    (function () {
      const model = new Model(testAppName, 'Test');
    }).should.throw() // TODO error
  });

  it('should not throw if defaultsTo value is within minLength & maxLength', () => {
    testApp.config = {
      attributes: {
        'a1': {
          type: 'string',
          minLength: 1,
          maxLength: 3,
          defaultsTo: 'ab',
        },
      }
    };

    const model = new Model(testAppName, 'Test');
  });

  afterEach(() => {
    internals.deleteInstance(testAppName);
  });

});
