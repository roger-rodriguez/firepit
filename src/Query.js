const { UTILS, STRINGS } = require('./internals');
const { isInteger, isString, isObject, mergeDeep, isArrayOfStrings, deferredPromise, typeOf } = UTILS;
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
   * @param value
   * @return {Query}
   */
  limit(value) {
    if (this._isFindOne) throw new Error(STRINGS.QUERY_LIMIT_USAGE_WITH_FINDONE);
    if (!isInteger(value)) throw new Error(STRINGS.INVALID_PARAM_TYPE('limit', 'value', 'integer', typeOf(value)));
    if (value < 0) throw new Error(STRINGS.QUERY_LIMIT_LESS_THAN_ZERO);
    this._limit = value;
    return this;
  }

  /**
   *
   * @param value
   * @return {Query}
   */
  page(value) {
    if (!isInteger(value)) throw new Error(STRINGS.INVALID_PARAM_TYPE('page', 'value', 'integer', typeOf(value)));
    if (value < 0) throw new Error(STRINGS.QUERY_PAGE_LESS_THAN_ZERO);
    this._page = value;
    return this;
  }

  /**
   *
   * @param criteria
   * @return {Query}
   */
  where(criteria) {
    if (!isObject(criteria)) throw new Error(STRINGS.INVALID_PARAM_TYPE('where', 'criteria', 'object', typeOf(criteria)));
    mergeDeep(this._criteria, criteria);
    return this;
  }

  /**
   *
   * @param arrayOfFields
   * @return {Query}
   */
  select(arrayOfFields) {
    if (!isArrayOfStrings(arrayOfFields)) throw new Error(STRINGS.QUERY_SELECT_INVALID_TYPE);
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
        throw new Error(STRINGS.QUERY_SORT_INVALID_FIELD_NAME(field));
      }

      if (!isValidSort(value)) {
        throw new Error(STRINGS.QUERY_SORT_INVALID_FIELD_VALUE(value));
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
    if (!isString(field)) throw new Error(STRINGS.INVALID_PARAM_TYPE('populate', 'field', 'string', typeOf(field)));
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
