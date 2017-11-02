const { APPS, DEFAULTS, UTILS, STRINGS } = require('./');

const {
  validateType, validateDefaultValue, validateEnums,
  validateRequired, validateFieldName, validateLength,
  validateValidate,
} = require('../validate/schema');

const {
  mergeDeep, isString,
} = UTILS;

class SchemaInternal {

  /**
   *
   * @param appName
   * @param modelName
   * @param schema
   */
  constructor(appName, modelName, schema) {
    this._appName = appName;
    this._modelName = modelName;
    this._validatedAssociations = false;
    this._schema = mergeDeep(
      Object.assign({}, DEFAULTS.schema(modelName), schema || APPS[appName].config),
      APPS[appName].schemas[modelName]
    );
    this._hasMany = {};
    this._hasOne = {};
    this._associations = {};

    this._validate();
  }

  /**
   *
   * @private
   */
  _validate() {
    if (this._schema.schema && (!this._schema.attributes || !Object.keys(this._schema.attributes).length)) {
      throw new Error(STRINGS.ERROR_ATTRIBUTES_REQUIRED(this._modelName));
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
      validateRequired(key, this._modelName, attribute);

      if (attribute.hasOne) {
        attribute.hasOne = attribute.hasOne.toLowerCase();
        this._hasOne[attribute.fieldName] = attribute;
        continue;
      }

      if (attribute.hasMany) {
        attribute.hasMany = attribute.hasMany.toLowerCase();
        this._hasMany[attribute.fieldName] = attribute;
        continue;
      }

      validateType(key, this._modelName, attribute);
      validateDefaultValue(key, this._modelName, attribute);
      validateEnums(key, this._modelName, attribute);
      validateLength(key, this._modelName, attribute);
      validateValidate(key, this._modelName, attribute);
    }
  }

  _validateAssociations() {
    this._validateHasOneAssociations();
    this._validateHasManyAssociations();
    this._validatedAssociations = true;

    this._associations = Object.assign({}, this._hasMany, this._hasOne);
    debugger;
  }

  _validateHasOneAssociations() {
    const keys = Object.keys(this._hasOne);

    // Has One
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const attribute = this._hasOne[key];

      // if (!attribute.via) {
      //   throw new Error(`hasOne attribute is missing a 'via' property`);
      // }

      // todo validate validations
      // if (!APPS[this._appName].models[attribute.hasOne]) {
      //   throw new Error(`hasOne defined with a collection "${attribute.hasOne}" which has not been defined`);
      // }
      //
      // if (!APPS[this._appName].schemas[attribute.hasOne].attributes[attribute.via]) {
      //   throw new Error(`hasOne defined with an association "${attribute.via}" which does not exist on model "${attribute.hasOne}"`);
      // }
      //
      // if (APPS[this._appName].schemas[attribute.hasOne].attributes[attribute.via].type !== 'string') {
      //   throw new Error(`hasOne defined with an association "${attribute.via}" on "${attribute.hasOne}" model, which is not of type string`);
      // }

      this._hasOne[key].model = APPS[this._appName].models[attribute.hasOne];
    }
  }

  _validateHasManyAssociations() {
    const keys = Object.keys(this._hasMany);
    const definedAssociations = {};

    // Has One
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const attribute = this._hasMany[key];

      if (!APPS[this._appName].models[attribute.hasMany]) {
        throw new Error(`hasMany defined with a model "${attribute.hasMany}" which has not been defined`);
      }

      // if (definedAssociations[attribute.hasMany]) {
      //   throw new Error(`hasMany association "${attribute.hasMany}" has already been defined on this model on attribute "${definedAssociations[attribute.hasMany]}"`);
      // }

      definedAssociations[attribute.hasMany] = key;
      this._hasMany[key].model = APPS[this._appName].models[attribute.hasMany];

    }
  }
}

module.exports = SchemaInternal;
