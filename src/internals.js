const internals = {
  apps: {},
  validTypes: ['any', 'string', 'email', 'integer', 'float', 'datetime', 'boolean', 'binary', 'array', 'json'],
};

module.exports = internals;

module.exports.createInstance = function (appInstance) {
  internals.apps[appInstance.name] = {
    app: appInstance,
    schemas: {},
    models: {},
    config: null,
  };
};
