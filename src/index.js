const Model = require('./Model');
const { APPS, createInstance } = require('./internals');

/**
 *
 */
function initialize() {
  const appName = this.appInstance.name;

  const appInternal = APPS[appName];

  const schemaKeys = Object.keys(appInternal.schemas);

  // init models
  for (let i = 0, len = schemaKeys.length; i < len; i++) {
    // validate model associations
    appInternal.models[schemaKeys[i]].schema._validateAssociations();
  }
}

/**
 *
 * @param name
 * @param schema
 * @returns Model
 */
function createModel(name, schema) {
  if (!name) throw new Error('name required'); // todo

  const appName = this.appInstance.name;

  // store the originally passed user schema
  APPS[appName].schemas[name] = schema;

  // create the model
  APPS[appName].models[name] = new Model(appName, name, schema);

  // return created model
  return APPS[appName].models[name];
}

/**
 *
 * @param name
 * @returns Model
 */
function model(name) {
  if (!name) throw new Error('name required'); // todo
  const model = APPS[this.appInstance.name].models[name];
  if (!model) throw new Error('404 model not found'); // todo
  return model;
}


module.exports = {
  /**
   *
   * @param appInstance
   * @param config
   * @return {*}
   */
  use(appInstance, config) {
    // todo attached differently based on what sdk/platform i.e RNFirebase is different
    const _firepit = Object.assign(
      { appInstance },
      { initialize, createModel, model },
    );

    const appName = appInstance.name;

    if (!APPS[appName]) {
      createInstance(appInstance);
    }

    const appInternal = APPS[appName];

    appInternal.config = Object.assign({}, config);

    appInstance.extendApp_({
      // todo switch apps if app passed i.e firebase.firepit(app <--- this)
      firepit: ((appInstanceOrName) => _firepit).bind(appInstance),
    });

    appInstance.firebaseInternals_.firebase_.firepit = ((appName) => _firepit).bind(appInstance);
    return appInstance;
  },
};
