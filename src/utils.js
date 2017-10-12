const deeps = require('deeps');



module.exports = {};

/**
 *   TYPES
 */

module.exports.typeOf = function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

module.exports.isPrimitive = function isPrimitive(value) {
  return ['string', 'number', 'boolean', 'null'].includes(typeOf(value));
};

module.exports.isObject = function isObject(value) {
  return (value && typeof value === 'object' && !Array.isArray(value) && value !== null);
};

module.exports.isFloat = function isFloat(value) {
  return Number(value) === value && value % 1 !== 0;
};

module.exports.isDate = function isDate(value) {
  return value instanceof Date;
};

module.exports.isBoolean = function isBoolean(value) {
  return typeof value === 'boolean';
};

module.exports.isString = function isString(value) {
  return typeof value === 'string';
};

module.exports.isInteger = function isInteger(value) {
  return value === parseInt(value, 10);
};

module.exports.isNull = function isNull(value) {
  return value === null;
};

/*
 *    MISC
 */

module.exports.toFirstUpper = function toFirstUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};



module.exports.mergeDeep = deeps.merge;
module.exports.hasOwnProp = (target, prop) => Object.hasOwnProperty.call(target, prop);


