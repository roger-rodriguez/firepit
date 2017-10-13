const INTERNALS = require('./index');

module.exports = {
  ERROR_INVALID_MODEL_NAME(name) {
    return `Model name ${name} is invalid, must be...`; // TODO
  },

  ERROR_MISSING_MODEL_NAME: 'Model must be given a valid name when calling \'createModel(name <-- requires a valid string value.',

  ERROR_MODEL_NOT_FOUND(name) {
    return `The model ${name} could not be found. Have you created it by calling 'createModel(${name})'?`;
  },

  ERROR_ATTRIBUTES_REQUIRED(model) {
    return `The model ${model} requires attributes. To create a model with no attributes set the schema value to false.`;
  },

  /**
   * Attribute Validation
   */

  // validateType
  ERROR_INVALID_ATTRIBUTE_TYPE(model, attribute, type) {
    return `Invalid type ${type} given for attribute ${attribute} in ${model} model. Must be one of: ${Object.keys(INTERNALS.TYPES).join(', ')}.`;
  },

  // validateDefaultValue
  ERROR_INVALID_ATTRIBUTE_DEFAULT(model, attribute, type, defaultType) {
    return `Invalid defaultsTo value for attribute ${attribute} in ${model} model. Expected type ${type} but got ${defaultType}.`;
  },

  // validateEnums
  ERROR_INVALID_ATTRIBUTE_DEFAULT_IN_ENUM(model, attribute, defaultValue, enumValue) {
    return `The given defaultsTo value for attribute ${attribute} in ${model} model is invalid. Expected one of ${enumValue.join(', ')} but got ${defaultValue}.`;
  },

  // validateEnums
  ERROR_INVALID_ATTRIBUTE_ENUM_PROPERTY(model, attribute, givenType) {
    return `The given enum property for attribute ${attribute} in ${model} model is invalid. Expected type array but got ${givenType}.`;
  },

  // validateEnums
  ERROR_INVALID_ATTRIBUTE_ENUM_VALUE(model, attribute, expectedType, givenType) {
    return `A given enum value for attribute ${attribute} in ${model} model is invalid. Expected type ${expectedType} but got ${givenType}.`;
  },

  // validateEnums
  ERROR_INVALID_ATTRIBUTE_ENUM_PRIMITIVE(model, attribute, givenType) {
    return `A given enum value for attribute ${attribute} in ${model} model is invalid. Expected type primitive type but got ${givenType}.`;
  },

  // validateRequired
  ERROR_INVALID_ATTRIBUTE_REQUIRED(model, attribute, type) {
    return `Invalid required value given for attribute ${attribute} in ${model} model. Expected type boolean but got ${type}.`;
  },

  // validateFieldName
  ERROR_INVALID_ATTRIBUTE_FIELD_NAME(model, attribute, value) {
    return `Invalid fieldName value given for attribute ${attribute} in ${model} model. ${value} is not a valid Cloud Firestore field name.`;
  },

  // isValidLength
  ERROR_INVALID_ATTRIBUTE_FIELD_LENGTH_TYPE(model, attribute, field, givenType) {
    return `Invalid ${field} value given for attribute ${attribute} in ${model} model. Expected integer but got ${givenType}.`;
  },

  // isValidLength
  ERROR_INVALID_ATTRIBUTE_FIELD_LENGTH_SIZE(model, attribute, field) {
    return `Invalid ${field} value given for attribute ${attribute} in ${model} model. Value must be greater than 0 (zero).`;
  },

  // validateLength
  ERROR_INVALID_ATTRIBUTE_TYPE_FOR_LENGTH(model, attribute, type, field) {
    return `Using ${field} property for attribute ${attribute} in ${model} model is invalid when attribute type is not a string. Expected attribute type string but got ${type}.`; // TODO waffle
  },

  // validateLength
  ERROR_INVALID_ATTRIBUTE_MIN_MAX(model, attribute) {
    return `Invalid minLength value given for attribute ${attribute} in ${model} model. Value must be less than maxLength value.`;
  },



};
