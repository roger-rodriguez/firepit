const Model = require('./Model');
const INTERNALS = require('./internals');

const firepit = {
  initialize: function (config) {
    const appName = this.appInstance.name;
    const appInternal = INTERNALS.apps[appName];

    appInternal.config = Object.assign({}, config);

    const schemaKeys = Object.keys(appInternal.schemas);
    // Init models
    for (let i = 0, len = schemaKeys.length; i < len; i++) {
      const key = schemaKeys[i];
      const schema = appInternal.schemas[i];
      appInternal.models[key] = new Model(appName, key, schema);
    }
    // Validate models/associations
    for (let i = 0, len = schemaKeys.length; i < len; i++) {
      const key = schemaKeys[i];
      appInternal.models[key].validateSchema();
    }
  },
  model: function (name, schema) {
    if (!name) throw new Error('name required'); // todo

    const appName = this.appInstance.name;

    if (!INTERNALS.apps[appName]) {
      INTERNALS.createInstance(this.appInstance);
    }

    INTERNALS.apps[appName].schemas[name] = schema;
  },
};

module.exports = (appInstance) => {
  const _firepit = Object.assign({ appInstance }, firepit);

  appInstance.extendApp_({
    firepit: ((appName) => _firepit).bind(appInstance),
  });

  appInstance.firebaseInternals_.firebase_.firepit = ((appName) => _firepit).bind(appInstance);
  return appInstance;
};
