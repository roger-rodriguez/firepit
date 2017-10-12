const deeps = require('deeps');
const INTERNALS = require('./internals');

function schemaDefaults(name) {
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

const hasOwnProperty = Object.hasOwnProperty;

// TODO Handle all attribute types
function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isString(value) {
  return typeof value === 'boolean';
}

function isInteger(value) {
  return value === parseInt(value, 10)
}

class BaseModel {

  constructor(appName, modelName) {
    this.appName = appName;
    this.modelName = modelName;
    this.app = INTERNALS.apps[appName].app;
    this.schema = deeps.merge(Object.assign({}, schemaDefaults(this.modelName), INTERNALS.apps[appName].config), INTERNALS.apps[appName].schemas[modelName]);
  }

  validateSchema() {
    if (this.schema.schema && (!this.schema.attributes || !Object.keys(this.schema.attributes).length)) {
      throw new Error('No schema attributes but is required'); // TODO
    }

    const keys = Object.keys(this.schema.attributes || {});

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      let attribute = this.schema.attributes[key];

      if (typeof attribute === 'string') {
        attribute = this.schema.attributes[key] = {
          type: attribute,
        };
      }

      // TODO What if there's 2 attributes with the same fieldName
      if (!hasOwnProperty.call(attribute, 'fieldName')) {

      }

      this.validateType(key, attribute);
      this.validateDefaultValue(key, attribute);
      this.validateEnums(key, attribute);
      this.validateRequired(key, attribute);
      this.validateFieldName(key, attribute);
      this.validateLength(key, attribute);
    }
  }

  validateType(key, attribute) {
    if (!INTERNALS.validTypes.includes(attribute.type)) {
      throw new Error(`Type ${attribute.type} aint valid`); // TODO
    }
  }

  validateDefaultValue(key, attribute) {
    if (attribute.type !== 'any' && hasOwnProperty.call(attribute, 'defaultsTo')) {
      if (typeOf(attribute.defaultsTo) !== attribute.type) {
        throw new Error(`Default value ${attribute.defaultsTo} is not of type ${attribute.type}`); // TODO
      }
    }
  }

  validateEnums(key, attribute) {
    if (hasOwnProperty.call(attribute, 'enum')) {
      if (typeOf(attribute.enum) !== 'array') {
        throw new Error(`Enum prop must be an array`); // TODO
      }

      if (attribute.type !== 'any') {
        for (let i = 0, len = attribute.enum.length; i < len; i++) {
          const value = attribute.enum[i];
          if (typeOf(value) !== attribute.type) {
            throw new Error(`Enum contains value isnt of the type ${attribute.type}`); // TODO
          }
        }
      } else {
        for (let i = 0, len = attribute.enum.length; i < len; i++) {
          const value = attribute.enum[i];
          if (typeOf(value) !== 'string' || typeOf(value) !== 'number') {
            throw new Error(`Enum contains value which isnt a primitive value`); // TODO
          }
        }
      }

      if (hasOwnProperty.call(attribute, 'defaultsTo') && !attribute.enum.includes(attribute.defaultsTo)) {
        throw new Error(`Default value not in enum array`); // TODO
      }
    }
  }

  validateRequired(key, attribute) {
    if (hasOwnProperty.call(attribute, 'required') && !isBoolean(attribute.required)) {
      throw new Error(`Required key is not a bool`); // TODO
    }
  }

  validateFieldName(key, attribute) {
    // if (!isString(attribute.fieldName)) { // TODO no spaces/funky chars
    //   throw new Error('Field name must be a string'); // TODO
    // }
  }

  _isValidLength(type, value) {
    if (!isInteger(value)) {
      throw new Error(`${type} must be an integer`); // TODO
    }

    if (value < 0) {
      throw new Error(`${type} value must be greater than 0`); // TODO
    }
  }

  validateLength(key, attribute) {
    if (hasOwnProperty.call(attribute, 'minLength') || hasOwnProperty.call(attribute, 'maxLength')) {
      if (typeOf(attribute.type) !== 'string') {
        throw new Error(`Using minLength or maxLength requires attribute type to be string`); // TODO
      }

      if (hasOwnProperty.call(attribute, 'minLength')) {
        this._isValidLength('minLength', attribute.minLength);
      }
      if (hasOwnProperty.call(attribute, 'maxLength')) {
        this._isValidLength('maxLength', attribute.maxLength);
      }
      if (hasOwnProperty.call(attribute, 'minLength') && hasOwnProperty.call(attribute, 'maxLength')) {
        if (attribute.minLength >= attribute.maxLength) {
          throw new Error(`minLength has to be less than maxLength`); // TODO
        }
        if (attribute.minLength > attribute.maxLength) {
          throw new Error(`maxLength has to be greater than minLength`); // TODO
        }
      }
    }
  }

}

module.exports = BaseModel;
