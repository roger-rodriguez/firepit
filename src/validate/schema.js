const { TYPES, UTILS } = require('./../internals');

const { validateValueForType, isValidFirestoreField } = require('./shared');
const { hasOwnProp, isInteger, typeOf } = UTILS;

module.exports = {
  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateType(key, modelName, attribute) {
    if (!TYPES[attribute.type]) {
      throw new Error(`Type ${attribute.type} aint valid`); // TODO
    }
  },

  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateDefaultValue(key, modelName, attribute) {
    if (hasOwnProp(attribute, 'defaultsTo')) {
      if (!validateValueForType(attribute.defaultsTo, attribute.type)) {
        throw new Error(`Default value ${attribute.defaultsTo} is not of type ${attribute.type}`); // TODO
      }
    }
  },

  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateEnums(key, modelName, attribute) {
    if (hasOwnProp(attribute, 'enum')) {
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

      if (hasOwnProp(attribute, 'defaultsTo') && !attribute.enum.includes(attribute.defaultsTo)) {
        throw new Error(`Default value not in enum array`); // TODO
      }
    }
  },

  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateRequired(key, modelName, attribute) {
    if (hasOwnProp(attribute, 'required') && !isBoolean(attribute.required)) {
      throw new Error(`Required key is not a bool`); // TODO
    }
  },

  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateFieldName(key, modelName, attribute) {
    const valid = isValidFirestoreField(attribute.fieldName);

    if (!valid) {
      throw new Error(`Field ${attribute.fieldName} is not a valid Cloud Firestore field name`); // TODO
    }
  },

  /**
   *
   * @param type
   * @param value
   */
  isValidLength(type, value) {
    if (!isInteger(value)) {
      throw new Error(`${type} must be an integer`); // TODO
    }

    if (value < 0) {
      throw new Error(`${type} value must be greater than 0`); // TODO
    }
  },

  /**
   *
   * @param key
   * @param modelName
   * @param attribute
   */
  validateLength(key, modelName, attribute) {
    if (hasOwnProp(attribute, 'minLength') || hasOwnProp(attribute, 'maxLength')) {
      if (typeOf(attribute.type) !== 'string') {
        throw new Error(`Using minLength or maxLength requires attribute type to be string`); // TODO
      }

      if (hasOwnProp(attribute, 'minLength')) {
        this.isValidLength('minLength', attribute.minLength);
      }
      if (hasOwnProp(attribute, 'maxLength')) {
        this.isValidLength('maxLength', attribute.maxLength);
      }
      if (hasOwnProp(attribute, 'minLength') && hasOwnProp(attribute, 'maxLength')) {
        if (attribute.minLength >= attribute.maxLength) {
          throw new Error(`minLength has to be less than maxLength`); // TODO
        }
        if (attribute.minLength > attribute.maxLength) {
          throw new Error(`maxLength has to be greater than minLength`); // TODO
        }
      }
    }
  }
};
