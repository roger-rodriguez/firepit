const { APPS } = require('./internals');

const SchemaInternal = require('./internals/SchemaInternal');

class Schema extends SchemaInternal {
  /**
   *
   * @param appName
   * @param modelName
   * @param schemaObj
   */
  constructor(appName, modelName, schemaObj) {
    super(appName, modelName, schemaObj);
  }

  get app() {
    return APPS[this._appName].app;
  }

  get identity() {
    return this._schema.identity;
  }

  get autoId() {
    return this._schema.autoId;
  }

  get autoCreatedAt() {
    return this._schema.autoCreatedAt;
  }

  get autoCreatedBy() {
    return this._schema.autoCreatedBy;
  }

  get autoUpdatedAt() {
    return this._schema.autoUpdatedAt;
  }

  get autoUpdatedBy() {
    return this._schema.autoUpdatedBy;
  }

  get collectionName() {
    return this._schema.collectionName;
  }

  get schema() {
    return this._schema.schema;
  }

  get attributes() {
    return Object.assign({}, this._schema.attributes);
  }
}

module.exports = Schema;
