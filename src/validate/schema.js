const { TYPES, UTILS, STRINGS } = require('./../internals');

const { validateValueForType, isValidFirestoreField } = require('./shared');
const { hasOwnProp, isInteger, isString, isFunction, isBoolean, isPrimitive, typeOf } = UTILS;

/**
 * Validates an attribute has a valid type property, such as string, object, null etc
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateType = function validateType(key, modelName, attribute) {
  if (!TYPES[attribute.type]) {
    throw new Error(STRINGS.ATTRIBUTE_TYPE_INVALID(modelName, attribute, Object.keys(TYPES).join(', ')));
  }
};

/**
 * Validates that a string can be a key on the Firestore database
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateFieldName = function validateFieldName(key, modelName, attribute) {
  if (!isString(attribute.fieldName)) {
    throw new Error(STRINGS.ATTRIBUTE_FIELD_NAME_TYPE_INVALID(modelName, key, typeOf(attribute.fieldName)));
  }

  const valid = isValidFirestoreField(attribute.fieldName);

  if (!valid) {
    throw new Error(STRINGS.ATTRIBUTE_FIELD_NAME_INVALID(modelName, key, attribute.fieldName));
  }
};

/**
 * Validates that a given defaultsTo value is the same as the attribute type
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateDefaultValue = function validateDefaultValue(key, modelName, attribute) {
  if (hasOwnProp(attribute, 'defaultsTo')) {
    if (!validateValueForType(attribute.defaultsTo, attribute.type)) {
      throw new Error(STRINGS.ATTRIBUTE_DEFAULTS_TO_INVALID(modelName, attribute, typeOf(attribute.defaultsTo)));
    }
  }
};

/**
 *
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateEnums = function validateEnums(key, modelName, attribute) {
  if (hasOwnProp(attribute, 'enum')) {
    if (typeOf(attribute.enum) !== 'array') {
      throw new Error(STRINGS.ATTRIBUTE_ENUM_INVALID_TYPE(modelName, attribute, typeOf(attribute.enum)));
    }

    if (attribute.enum.length === 0) {
      throw new Error(STRINGS.ATTRIBUTE_ENUM_EMPTY(modelName, attribute));
    }

    if (attribute.type !== 'any') {
      for (let i = 0, len = attribute.enum.length; i < len; i++) {
        const value = attribute.enum[i];
        if (typeOf(value) !== attribute.type) {
          throw new Error(STRINGS.ATTRIBUTE_ENUM_CONTAINS_INVALID_VALUE(modelName, attribute, typeOf(value)));
        }
      }
    } else {
      for (let i = 0, len = attribute.enum.length; i < len; i++) {
        const value = attribute.enum[i];
        if (!isPrimitive(value)) {
          throw new Error(STRINGS.ATTRIBUTE_ENUM_CONTAINS_NON_PRIMITIVE_VALUE(modelName, attribute, typeOf(value)));
        }
      }
    }

    if (hasOwnProp(attribute, 'defaultsTo') && !attribute.enum.includes(attribute.defaultsTo)) {
      throw new Error(STRINGS.ATTRIBUTE_DEFAULTS_TO_NOT_IN_ENUM(modelName, attribute));
    }
  }
};

/**
 *
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateRequired = function validateRequired(key, modelName, attribute) {
  if (hasOwnProp(attribute, 'required') && !isBoolean(attribute.required)) {
    throw new Error(STRINGS.ATTRIBUTE_REQUIRED_INVALID_TYPE(modelName, attribute, typeOf(attribute.required)));
  }
};

/**
 *
 * @type {exports.isValidLength}
 */
const isValidLength = module.exports.isValidLength = function isValidLength(property, modelName, attribute) {
  if (!isInteger(attribute[property])) {
    throw new Error(STRINGS.ATTRIBUTE_LENGTH_INVALID_TYPE(modelName, attribute, property, typeOf(attribute[property])));
  }

  if (attribute[property] < 0) {
    throw new Error(STRINGS.ATTRIBUTE_LENGTH_LESS_THAN_ZERO(modelName, attribute, property));
  }
};

/**
 *
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateLength = function validateLength(key, modelName, attribute) {
  if (hasOwnProp(attribute, 'minLength') || hasOwnProp(attribute, 'maxLength')) {
    if (attribute.type !== 'string') {
      throw new Error(STRINGS.ATTRIBUTE_LENGTH_REQUIRES_STRING_TYPE(modelName, attribute));
    }

    if (hasOwnProp(attribute, 'minLength')) {
      isValidLength('minLength', modelName, attribute);
    }
    if (hasOwnProp(attribute, 'maxLength')) {
      isValidLength('maxLength',modelName,  attribute);
    }
    if (hasOwnProp(attribute, 'minLength') && hasOwnProp(attribute, 'maxLength')) {
      if (attribute.minLength >= attribute.maxLength) {
        throw new Error(STRINGS.ATTRIBUTE_MIN_LENGTH_GREATER_THAN_MAX_LENGTH(modelName, attribute));
      }
    }

    if (hasOwnProp(attribute, 'defaultsTo')) {
      if (hasOwnProp(attribute, 'minLength') && attribute.defaultsTo.length < attribute.minLength) {
        throw new Error(STRINGS.ATTRIBUTE_MIN_LENGTH_GREATER_THAN_DEFAULTS_TO_VALUE(modelName, attribute));
      }
      if (hasOwnProp(attribute, 'maxLength') && attribute.defaultsTo.length > attribute.maxLength) {
        throw new Error(STRINGS.ATTRIBUTE_MAX_LENGTH_LESS_THAN_DEFAULTS_TO_VALUE(modelName, attribute));
      }
    }
  }
};

/**
 * @param key
 * @param modelName
 * @param attribute
 */
module.exports.validateValidate = function validateValidate(key, modelName, attribute) {
  if (hasOwnProp(attribute, 'validate')) {
    if (!isFunction(attribute.validate)) {
      throw new Error(STRINGS.ATTRIBUTE_VALIDATE_INVALID_TYPE(modelName, attribute, typeOf(attribute.validate)));
    }

    if (hasOwnProp(attribute, 'defaultsTo')) {
      attribute.validate(attribute.defaultsTo);
    }
  }
};
