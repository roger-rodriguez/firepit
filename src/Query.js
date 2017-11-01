const { UTILS } = require('./internals');
const { isInteger, isString, isObject, mergeDeep, isArrayOfStrings, deferredPromise } = UTILS;
const { isValidFirestoreField, isValidSort } = require('./validate/shared');
const QueryInternal = require('./internals/QueryInternal');

class Query extends QueryInternal {
  /**
   *
   * @param model {Model}
   * @param criteriaOrString {Object|String}
   * @param possibleValue {undefined|any}
   */
  constructor(model, criteriaOrString, possibleValue) {
    super(model, criteriaOrString, possibleValue);
  }

  /**
   *
   * @param val
   * @return {Query}
   */
  limit(val) {
    if (this._isFindOne) throw new Error('limit cannot be used with findOne');
    if (!isInteger(val)) throw new Error('limit must be an integer'); // todo
    if (val < 0) throw new Error('limit should not be less than 0'); // todo
    this._limit = val;
    return this;
  }

  /**
   *
   * @param val
   * @return {Query}
   */
  page(val) {
    if (!isInteger(val)) throw new Error('page must be an integer'); // todo
    if (val < 0) throw new Error('page should not be less than 0'); // todo
    this._page = val;
    return this;
  }

  /**
   *
   * @param criteria
   * @return {Query}
   */
  where(criteria) {
    if (!isObject(criteria)) throw new Error('criteria must be an object'); // todo
    mergeDeep(this._criteria, criteria);
    return this;
  }

  /**
   *
   * @param arrayOfFields
   * @return {Query}
   */
  select(arrayOfFields) {
    if (!isArrayOfStrings(arrayOfFields)) throw new Error('field to select must be an array of strings'); // todo
    const out = {};
    for (let i = 0, len = arrayOfFields.length; i < len; i++) {
      out[arrayOfFields[i]] = true;
    }
    this._select = out;
    return this;
  }

  /**
   *
   * @param sortCriteria
   * @param sortValue
   * @return {Query}
   */
  sort(sortCriteria, sortValue) {
    let _sortCriteria = sortCriteria;
    if (isString(sortCriteria)) {
      _sortCriteria = { [sortCriteria]: sortValue === undefined ? 'asc' : sortValue };
    }

    // validate
    const entries = Object.entries(_sortCriteria);

    for (let i = 0, len = entries.length; i < len; i++) {
      const field = entries[i][0];
      const value = entries[i][1];

      if (!isValidFirestoreField(field)) {
        throw new Error('invalid firestore field name for sort()'); // todo
      }

      if (!isValidFirestoreField(field)) {
        throw new Error('invalid firestore field name for sort()'); // todo
      }

      if (!isValidSort(value)) {
        throw new Error('sort value must be one of X Y Z'); // todo
      }
    }

    this._sort = mergeDeep(this._sort || {}, _sortCriteria);
    return this;
  }

  /**
   *
   * @param field
   */
  populate(field) {
    if (!isString(field)) throw new Error('field to populate must be of type string'); // todo
    return this;
  }

  /**
   * Promise .then proxy
   * @param fn
   */
  then(fn) {
    const deferred = deferredPromise();
    // transform output TODO move me / transform error output
    this.nativeQuery.get().then(this._handleQueryResponse.bind(this, deferred)).catch(deferred._reject);
    return deferred.promise.then.bind(deferred.promise)(fn);
  }

  /**
   * Promise .catch proxy
   * @param fn
   */
  catch(fn) {
    const deferred = deferredPromise();
    // todo transform error output
    this.nativeQuery.get().then().catch(deferred._reject);
    return deferred.promise.catch.bind(deferred.promise)(fn);
  }
}

module.exports = Query;
