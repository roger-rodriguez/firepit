const INTERNALS = {};

// initialized apps
INTERNALS.APPS = {};

// default values used internally
INTERNALS.DEFAULTS = {
  schema(name) {
    return {
      schema: true,
      app: '[DEFAULT]',
      identity: name.toLowerCase(),
      autoId: true,
      autoCreatedAt: true,
      autoUpdatedAt: true,
      autoCreatedBy: true,
      autoUpdatedBy: true,
      collectionName: name.toLowerCase(), // TODO identity vs collectionName
    };
  }
};

// field types
INTERNALS.TYPES = {
  any: 'any',
  json: 'string',
  null: 'null',
  array: 'array',
  object: 'object',
  float: 'number',
  string: 'string',
  integer: 'number',
  boolean: 'boolean',
  datetime: 'date',
};

/* --------------
 *     METHODS
 * ------------ */

/**
 *
 * @param appInstance
 * @param config
 * @return {*}
 */
INTERNALS.createInstance = function createInstance(appInstance, config) {
  INTERNALS.APPS[appInstance.name] = {
    app: appInstance,
    schemas: {},
    models: {},
    config: config || null,
  };

  return INTERNALS.APPS[appInstance.name];
};

/**
 *
 * @param appName
 */
INTERNALS.deleteInstance = function deleteInstance(appName) {
  // todo cleanup listeners etc when added later on
  delete INTERNALS.APPS[appName];
};

INTERNALS.UTILS = require('../utils');

INTERNALS.STRINGS = require('./strings');

module.exports = INTERNALS;

