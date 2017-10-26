function typeMap(type, check) {
  const map = {
    json: {
      'a1': {
        type,
        defaultsTo: JSON.stringify({ foo: 'bar' }),
      }
    },
    null: {
      'a1': {
        type,
        defaultsTo: null,
      }
    },
    array: {
      'a1': {
        type,
        defaultsTo: ['1', 2, { 3: null }],
      }
    },
    object: {
      'a1': {
        type,
        defaultsTo: { foo: 'bar' },
      }
    },
    string: {
      'a1': {
        type,
        defaultsTo: '123',
      },
    },
    integer: {
      'a1': {
        type,
        defaultsTo: 1,
      },
      'a2': {
        type,
        defaultsTo: 0,
      },
    },
    float: {
      'a1': {
        type,
        defaultsTo: 0.5,
      },
    },
    boolean: {
      'a1': {
        type,
        defaultsTo: true,
      },
      'a2': {
        type,
        defaultsTo: false,
      },
    },
    datetime: {
      'a1': {
        type,
        defaultsTo: new Date(),
      },
    },
  };

  return map[check];
}

module.exports = function (type, check) {
  return {
    attributes: typeMap(type, check),
  };
};
