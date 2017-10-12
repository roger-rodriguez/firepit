const Model = require('../../src/Model');

const testTypes = {
  a: {
    type: 'string',
  },
  b: {
    type: 'integer',
  },
  c: {
    type: 'float',
  },
  d: {
    type: 'datetime', // TODO date or datetime?
  },
  e: {
    type: 'boolean',
  },
  f: {
    type: 'binary',
  },
  g: {
    type: 'array',
  },
  h: {
    type: 'json',
  },
  i: {
    type: 'enum'
  }
};

describe('Model attributes', () => {

  describe('Valid default types', () => {

    it('should not throw when not using a string type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'string',
            defaultsTo: '123',
          },
          bar: {
            type: 'string',
            defaultsTo: '{ foo: "bar" }',
          },
        },
      });
    });

    it('should not throw when not using a integer type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'integer',
            defaultsTo: 1,
          },
          bar: {
            type: 'integer',
            defaultsTo: 0,
          },
          baz: {
            type: 'integer',
            defaultsTo: 123456789123456789123456789,
          },
        },
      });
    });

    it('should not throw when not using a float type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'float',
            defaultsTo: 0.0,
          },
          bar: {
            type: 'float',
            defaultsTo: 0.5,
          },
          baz: {
            type: 'float',
            defaultsTo: 0.123,
          },
          bob: {
            type: 'float',
            defaultsTo: 123456789.123456789,
          },
        },
      });
    });

    it('should not throw when not using a datetime type', () => {

    });

    it('should not throw when not using a boolean type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'boolean',
            defaultsTo: true,
          },
          bar: {
            type: 'boolean',
            defaultsTo: false,
          },
        },
      });
    });

    it('should not throw when not using a binary type', () => {

    });

    it('should not throw when not using a array type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'array',
            defaultsTo: [],
          },
          bar: {
            type: 'array',
            defaultsTo: [1, '2'],
          },
          baz: {
            type: 'array',
            defaultsTo: [{ foo: 'bar' }, 1, '2', [1, 2]],
          },
        },
      });
    });

    it('should not throw when not using a json type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'array',
            defaultsTo: JSON.stringify({
              foo: 'bar',
            }),
          },
        },
      });
    });

    it('should not throw when not using a enum type', () => {

    });

  });

  describe('Invalid default types', () => {


    it('should throw when not using a string type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'string',
            defaultsTo: 123,
          },
          bar: {
            type: 'string',
            defaultsTo: ['a', 1],
          },
          baz: {
            type: 'string',
            defaultsTo: {},
          }
        },
      });
    });


    it('should throw when not using a integer type', () => {
      const model = Model.create('Test', {
        attributes: {
          foo: {
            type: 'integer',
            defaultsTo: '123',
          },
          bar: {
            type: 'integer',
            defaultsTo: ['a', 1],
          },
          baz: {
            type: 'integer',
            defaultsTo: {},
          }
        },
      });

      it('should throw when not using a float type', () => {
        const model = Model.create('Test', {
          attributes: {
            foo: {
              type: 'float',
              defaultsTo: '0.1',
            },
            bar: {
              type: 'float',
              defaultsTo: 1,
            },
            baz: {
              type: 'float',
              defaultsTo: [0.1],
            }
          },
        });
      });

      it('should throw when not using a datetime type', () => {

      });


      it('should throw when not using a boolean type', () => {
        const model = Model.create('Test', {
          attributes: {
            foo: {
              type: 'boolean',
              defaultsTo: 'true',
            },
            bar: {
              type: 'boolean',
              defaultsTo: 1,
            },
            baz: {
              type: 'boolean',
              defaultsTo: 0,
            }
          },
        });
      });

      it('should throw when not using a binary type', () => {
        const model = Model.create('Test', {
          attributes: {
            foo: {
              type: 'binary',
              defaultsTo: null,
            },
            bar: {
              type: 'binary',
              defaultsTo: null,
            },
            baz: {
              type: 'binary',
              defaultsTo: null,
            }
          },
        });
      });

      it('should throw when not using a array type', () => {
        const model = Model.create('Test', {
          attributes: {
            foo: {
              type: 'array',
              defaultsTo: { foo: 'bar' },
            },
            bar: {
              type: 'array',
              defaultsTo: 123,
            },
            baz: {
              type: 'array',
              defaultsTo: 'array',
            }
          },
        });
      });

      it('should throw when not using a json type', () => {
        const model = Model.create('Test', {
          attributes: {
            foo: {
              type: 'json',
              defaultsTo: { foo: 'bar' },
            },
            bar: {
              type: 'json',
              defaultsTo: 123,
            },
            baz: {
              type: 'json',
              defaultsTo: '{ foo: "bar" }',
            }
          },
        });
      });

      it('should throw when not using a json type', () => {

      });

    });

  });
});
