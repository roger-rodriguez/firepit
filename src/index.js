const Model = require('./Model');
const Associations = require('./internals/Associations');
const { APPS, createInstance, deleteInstance, STRINGS } = require('./internals');
const { isValidModelName } = require('./validate/shared');
const { isString } = require('./utils');

/**
 *
 */
function initialize() {
  const appName = this.appInstance.name;

  const appInternal = APPS[appName];

  appInternal.associations = new Associations(appInternal);

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
  if (!name) throw new Error(STRINGS.MODEL_NAME_MISSING());
  if (!isString(name) || !isValidModelName(name)) throw new Error(STRINGS.MODEL_NAME_INVALID(name));

  const appName = this.appInstance.name;
  const _name = name.toLowerCase();

  // create the model
  APPS[appName].models[_name] = new Model(appName, _name, schema);

  // store the originally passed user schema
  APPS[appName].schemas[_name] = schema;

  // return created model
  return APPS[appName].models[_name];
}

/**
 *
 * @param name
 * @returns Model
 */
function model(name) {
  if (!isString(name)) throw new Error(STRINGS.MODEL_NAME_MISSING('model'));
  const model = APPS[this.appInstance.name].models[name.toLowerCase()];
  if (!model) throw new Error(STRINGS.MODEL_NOT_FOUND(name));
  return model;
}


module.exports = {

  /**
   * Deletes an app instance by name
   */
  deleteInstance,

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
