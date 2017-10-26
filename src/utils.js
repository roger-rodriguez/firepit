const deeps = require('deeps');

const AUTO_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

module.exports = {};

/**
 *   TYPES
 */

const typeOf = module.exports.typeOf = function typeOf(value) {
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

module.exports.isArray = function isArray(value) {
  return Array.isArray(value);
};

module.exports.isArrayOfStrings = function isArray(value) {
  if (!Array.isArray(value)) return false;
  for (let i = 0, len = value.length; i < len; i++) {
    if (typeof value[i] !== 'string') return false;
  }

  return true;
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

module.exports.isUndefined = function isUndefined(value) {
  return typeof value === 'undefined';
};

module.exports.isString = function isString(value) {
  return typeof value === 'string';
};

module.exports.isJSON = function isString(value) {
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.isInteger = function isInteger(value) {
  return value === parseInt(value, 10);
};

module.exports.isNull = function isNull(value) {
  return value === null;
};

module.exports.isFunction = function isFunction(value) {
  return typeof value === 'function';
};

/*
 *    MISC
 */

module.exports.toFirstUpper = function toFirstUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


/**
 * Generate a firestore auto id for use with collection/document .add()
 * @return {string}
 */
module.exports.generateDocumentId = function generateDocumentId() {
  let autoId = '';

  for (let i = 0; i < 20; i++) {
    autoId += AUTO_ID_CHARS.charAt(Math.floor(Math.random() * AUTO_ID_CHARS.length));
  }

  return autoId;
};

/**
 *
 * @param fn
 * @param cb
 */
module.exports.tryCatch = function tryCatch(fn) {
  let error;
  try {
    fn();
  } catch (catchError) {
    error = catchError;
  }

  return error;
};

/**
 * Create a new internal deferred promise, if not already created
 * @private
 */
module.exports.deferredPromise = function deferredPromise() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred._resolve = (result) => {
      // this._resolve = null;
      return resolve(result);
    };

    deferred._reject = (possibleError) => {
      // this._reject = null;
      return reject(possibleError);
    };
  });
  return deferred;
};

module.exports.batch = function batch(array, size) {
  const batches = [];
  while (array.length > 0) {
    batches.push(array.splice(0, size));
  }
  return batches;
};

module.exports.mergeDeep = deeps.merge;
module.exports.flatten = deeps.flatten;
module.exports.unflatten = deeps.unflatten;
module.exports.hasOwnProp = (target, prop) => Object.hasOwnProperty.call(target, prop);

