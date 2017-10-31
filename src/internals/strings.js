module.exports = {

  /**
   * Model
   */

  MODEL_NAME_MISSING(method = 'createModel') {
    return `Model must be given a valid name when calling ${method}(name <-- requires a valid string value.`;
  },

  MODEL_NAME_INVALID(name) {
    return `Model name "${name}" is invalid, must a string of only alpha and underscore characters.`;
  },

  MODEL_IN_USE(appInstance, name) {
    return `The model named "${name}" is already been declared on the Firebase app instance ${appInstance}`;
  },

  MODEL_NOT_FOUND(name) {
    return `The model "${name}" could not be found. Have you created it by calling createModel(${name} <-- unique model name.`;
  },

  /**
   * Attributes
   */

  ATTRIBUTE_TYPE_INVALID(model, attribute, types) {
    return `The attribute type "${attribute.type}" on the ${attribute.fieldName} attribute of the "${model}" model is invalid. Expected one of: ${types}.`
  },

  ATTRIBUTE_FIELD_NAME_TYPE_INVALID(model, key, givenType) {
    return `Invalid fieldName value given on the "${key}" attribute on the ""${model}"" model. Expected string got ${givenType}.`;
  },

  ATTRIBUTE_FIELD_NAME_INVALID(model, key, value) {
    return `Invalid fieldName value given on the "${key}" attribute on the "${model}" model. ${value} is not a valid Cloud Firestore field name.`;
  },

  ATTRIBUTE_DEFAULTS_TO_INVALID(model, attribute, givenType) {
    return `Invalid defaultsTo value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected type ${attribute.type} but got ${givenType}.`;
  },

  ATTRIBUTE_DEFAULTS_TO_NOT_IN_ENUM(model, attribute) {
    return `Invalid defaultsTo value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected one of "${attribute.enum.join(', ')}" but got ${attribute.defaultsTo}.`;
  },

  ATTRIBUTE_ENUM_INVALID_TYPE(model, attribute, givenType) {
    return `Invalid enum value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected type array but got ${givenType}.`;
  },

  ATTRIBUTE_ENUM_EMPTY(model, attribute) {
    return `Invalid enum value given on the "${attribute.fieldName}" attribute on the "${model}" model. Array cannot be empty.`;
  },

  ATTRIBUTE_ENUM_CONTAINS_INVALID_VALUE(model, attribute, givenType) {
    return `Invalid enum value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected array of type ${attribute.type} values but got value of type ${givenType}.`;
  },

  ATTRIBUTE_ENUM_CONTAINS_NON_PRIMITIVE_VALUE(model, attribute, givenType) {
    return `Invalid enum value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected array of primitive types values but got value of type ${givenType}.`;
  },

  ATTRIBUTE_REQUIRED_INVALID_TYPE(model, attribute, givenType) {
    return `Invalid required value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected type boolean but got ${givenType}.`;
  },

  ATTRIBUTE_LENGTH_INVALID_TYPE(model, attribute, property, givenType) {
    return `Invalid ${property} value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected type integer but got ${givenType}.`;
  },

  ATTRIBUTE_LENGTH_LESS_THAN_ZERO(model, attribute, property) {
    return `Invalid ${property} value given on the "${attribute.fieldName}" attribute on the "${model}" model. Value must be greater than 0.`;
  },

  ATTRIBUTE_LENGTH_REQUIRES_STRING_TYPE(model, attribute) {
    return `To use minLength or maxLength on the "${attribute.fieldName}" attribute on the "${model}" requires the attribute type to be string but got ${attribute.type}.`;
  },

  ATTRIBUTE_MIN_LENGTH_GREATER_THAN_MAX_LENGTH(model, attribute) {
    return `Invalid minLength value given on the "${attribute.fieldName}" attribute on the "${model}" model. minLength must be greater than maxLength.`;
  },

  ATTRIBUTE_MIN_LENGTH_GREATER_THAN_DEFAULTS_TO_VALUE(model, attribute) {
    return `Invalid defaultsTo value given on the "${attribute.fieldName}" attribute on the "${model}" model. The length of "${attribute.defaultsTo}" (${attribute.defaultsTo.length}) must not be less than the minLength (${attribute.minLength}).`;
  },

  ATTRIBUTE_MAX_LENGTH_LESS_THAN_DEFAULTS_TO_VALUE(model, attribute) {
    return `Invalid defaultsTo value given on the "${attribute.fieldName}" attribute on the "${model}" model. The length of "${attribute.defaultsTo}" (${attribute.defaultsTo.length}) must not be greater than the maxLength (${attribute.maxLength}).`;
  },

  ATTRIBUTE_VALIDATE_INVALID_TYPE(model, attribute) {
    return `Invalid validate value given on the "${attribute.fieldName}" attribute on the "${model}" model. Expected type function but got ${givenType}.`;
  },

  /**
   * Model Methods
   */

  MODEL_INVALID_PARAM_TYPE(method, param, type, givenType) {
    return `Invalid parameter "${param}" on method "${method}". Expected type ${type} but got ${givenType}.`;
  },

};
