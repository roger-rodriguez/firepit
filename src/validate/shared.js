const { UTILS } = require('./../internals');
const { isBoolean, isInteger, isArray, isNull, isString, isDate, isFloat, isObject } = UTILS;

const validatorForType = {
  any: () => true,
  json: isString,
  null: isNull,
  float: isFloat,
  array: isArray,
  datetime: isDate,
  object: isObject,
  string: isString,
  integer: isInteger,
  boolean: isBoolean,
};

const sorts = {
  '1': 'asc',
  '-1': 'asc',
  'asc': '1',
  'desc': '-1',
};

// Source: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical
const REGEXP_FIELD_NAME = new RegExp(
  `^(?:\\.?((?:(?:[A-Za-z_][A-Za-z_0-9]*)|(?:[A-Za-z_][A-Za-z_0-9]*))+))$`
);

// Source: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical
const REGEXP_FIELD_PATH = new RegExp(
  `^((?:(?:[A-Za-z_][A-Za-z_0-9]*)|(?:[A-Za-z_][A-Za-z_0-9]*))+)(?:\\.((?:(?:[A-Za-z_][A-Za-z_0-9]*)|(?:[A-Za-z_][A-Za-z_0-9]*))+))*$`
);

module.exports = {
  /**
   *
   * @param value
   * @param type
   * @return {*}
   */
  validateValueForType(value, type) {
    if (!validatorForType[type]) return false;
    return validatorForType[type](value);
  },

  /**
   *
   * @param value
   * @return {boolean}
   */
  isValidSort(value) {
    return !!sorts[value];
  },

  /**
   * Uses same validation regex from official SDK's.
   *  - undocumented on firestore docs: a key that starts with a number will fail on this regex
   * @param field
   * @param paths
   * @return {boolean}
   */
  isValidFirestoreField(field, paths) {
    return (paths ? REGEXP_FIELD_PATH : REGEXP_FIELD_NAME).test(field);
  }
};
