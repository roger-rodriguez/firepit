const { APPS, DEFAULTS, UTILS } = require('./');

const {
  validateType, validateDefaultValue, validateEnums,
  validateRequired, validateFieldName, validateLength,
} = require('../validate/schema');

const {
  mergeDeep, isString, hasOwnProp,
} = UTILS;


class SchemaInternal {
  constructor(appName, modelName, schema) {
    this._appName = appName;
    this._modelName = modelName;
    this._schema = mergeDeep(
      Object.assign({}, DEFAULTS.schema(modelName), schema || APPS[appName].config),
      APPS[appName].schemas[modelName]
    );
    this._validate();
  }

  _validate() {
    if (this._schema.schema && (!this._schema.attributes || !Object.keys(this._schema.attributes).length)) {
      throw new Error('No schema attributes but is required'); // TODO
    }

    const keys = Object.keys(this._schema.attributes || {});

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      let attribute = this._schema.attributes[key];

      if (isString(attribute)) {
        attribute = this._schema.attributes[key] = {
          type: attribute,
        };
      }

      if (!this._schema.attributes[key].fieldName) {
        this._schema.attributes[key].fieldName = key;
      }

      validateFieldName(key, this._modelName, attribute);
      validateType(key, this._modelName, attribute);
      validateDefaultValue(key, this._modelName, attribute);
      validateEnums(key, this._modelName, attribute);
      validateRequired(key, this._modelName, attribute);
      validateLength(key, this._modelName, attribute);

      // todo pluck associations fields and store as part of schema class - for later use
    }
  }

  _validateAssociations() {
    // todo validate any associations
  }
}

module.exports = SchemaInternal;
