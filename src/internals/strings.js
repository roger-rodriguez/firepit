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

  /**
   * @return {string}
   */
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
   * Query
   */

  QUERY_INVALID_ARGUMENTS(givenType) {
    return `Invalid arguments provided to Query. Expecting type string or object but got ${givenType}.`;
  },

  QUERY_FIELD_NAME_INVALID(givenType) {
    return `Invalid criteria field provided to Query. Expected type string but got ${givenType}.`;
  },

  QUERY_FIELD_VALUE_INVALID(givenType) {
    return `Invalid criteria value provided to Query. Expected primitive type but got ${givenType}. To access deeply nested values the field name can be passed as dot notated syntax.`;
  },

  /**
   * Query.limit
   */

  QUERY_LIMIT_USAGE_WITH_FINDONE: 'limit query modifier cannot be used with a findOne query.',

  QUERY_LIMIT_LESS_THAN_ZERO: 'limit query modifier cannot be less than 0.',

  /**
   * Query.limit
   */

  QUERY_PAGE_LESS_THAN_ZERO: 'page query modifier cannot be less than 0.',

  /**
   * Query.select
   */

  QUERY_SELECT_INVALID_TYPE: 'select query modifier must be an array of string field names.',

  /**
   * Query.sort
   */

  QUERY_SORT_INVALID_FIELD_NAME(field) {
    return `sort query modifier contains the field "${field}" which is an invalid Cloud Firestore field name.`
  },

  QUERY_SORT_INVALID_FIELD_VALUE(value) {
    return `Invalid value provided to sort query modifier. Expected one of asc, desc, -1, 1 but got ${value}.`;
  },

  /**
   * Model Methods
   */

  CRITERIA_CONTAINS_ID(method) {
    return `Given criteria to ${method} query cannot contain an id. Use .${method}(id <-- criteria id.`
  },

  CREATE_WITH_ID_AND_AUTOID: 'Given document to create query cannot contain an id as "autoId" is enabled for this model.',

  CREATE_WITHOUT_ID: 'Given document to create query must contain a unique id as "autoId" is disabled for this model.',

  CREATE_INVALID_ID(givenType) {
    return `Given document to create query contains an invalid id. Expected type string but got ${givenType}.`;
  },

  CREATE_DOCUMENT_EXISTS(id) {
    return `Document with the id "${id}" already exists in the database. Create query failed.`;
  },

  UPDATE_WITH_ID: 'Given document to update query cannot contain an id',

  DESTROY_INVALID_ARRAY: 'Given criteria to destroy method contains an array with a non-string value. Expected array of string ids.',

  INVALID_PARAM_TYPE(method, param, type, givenType) {
    return `Invalid parameter "${param}" on method "${method}". Expected type ${type} but got ${givenType}.`;
  },

  /**
   * Document Validation
   */

  VALIDATE_INVALID_TYPE(givenType) {
    return `Given document to query is an invalid type. Expected object but got ${givenType}`;
  },

  VALIDATE_INVALID_ATTRIBUTE_TYPE(attribute, type, givenType) {
    return `Invalid attribute type given for "${attribute}". Expected ${type} but got ${givenType}.`;
  },

  VALIDATE_MISSING_REQUIRED(attribute) {
    return `Missing required attribute "${attribute}".`;
  },

  VALIDATE_NOT_ENUM_TYPE(attribute, types, givenValue) {
    return `Invalid value given for attribute "${attribute}". Expected one of ${types.join(', ')} but got ${givenValue}`;
  },

  VALIDATE_INVALID_MINIMUM_LENGTH(attribute, minLength, givenLength) {
    return `Invalid attribute value given for "${attribute}". Expected minimum length of ${minLength} but got length ${givenLength}.`;
  },

  VALIDATE_INVALID_MAXIMUM_LENGTH(attribute, minLength, givenLength) {
    return `Invalid attribute value given for "${attribute}". Expected maxLength length of ${minLength} but got length ${givenLength}.`;
  },

  VALIDATE_ERRORS(errors) {
    return `Given document contains validation errors: \n\n${errors.map((e, i) => `${i+1}) ${e}`).join('\n')}`;
  },

};
