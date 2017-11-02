const { UTILS, STRINGS } = require('./');
const { sortMap } = require('./../validate/shared');
const documentSnapshot = require('./../convert/documentSnapshot');
const querySnapshot = require('./../convert/querySnapshot');

const {
  flatten, isString, isUndefined, isObject, isPrimitive, typeOf,
} = UTILS;


class QueryInternal {
  /**
   *
   * @param model {Model}
   * @param criteriaOrString {Object|String}
   * @param possibleValue? {undefined|any}
   */
  constructor(model, criteriaOrString, possibleValue) {
    if (!model.schema._validatedAssociations) {
      model.schema._validateAssociations();
    }

    this._page = 1;
    this._sort = null;
    this._docId = null;
    this._select = null;
    this._model = model;
    this._reject = null;
    this._resolve = null;
    this._populates = {};
    this._promise = null;
    this._criteria = null;
    this._isFindOne = false;
    this._limit = model.schema.limit;

    // filter object or single id
    if (isUndefined(possibleValue)) {
      if (isString(criteriaOrString)) this._docId = criteriaOrString;
      else if (isObject(criteriaOrString)) this._criteria = Object.assign({}, criteriaOrString);
      else throw new Error(STRINGS.QUERY_INVALID_ARGUMENTS(typeOf(criteriaOrString)));
    } else {
      // single field + value
      if (!isString(criteriaOrString)) throw new Error(STRINGS.QUERY_FIELD_NAME_INVALID(typeOf(criteriaOrString)));
      this._criteria = { [criteriaOrString]: possibleValue };
    }

    if (this._criteria) this.validateCriteria();
  }

  /**
   * Returns a flattened object of all the user specified criteria
   * @return {*}
   */
  get criteria() {
    return Object.assign({}, flatten(this._criteria || {}))
  }

  /**
   *
   * @return {*}
   */
  get nativeQuery() {
    let ref = this._model.nativeCollection;

    if (this._docId) {
      return ref.doc(this._docId);
    }

    // apply limits
    if (this._isFindOne) ref = ref.limit(1);
    else if (this._limit) ref = ref.limit(this._limit);

    // apply page/offset
    if (!this._isFindOne && this._page > 1) ref = ref.offset(this._page - 1 * this._limit);

    // apply conditions
    const fields = Object.entries(this.criteria);
    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i][0];
      const value = fields[i][1];
      // skip transaction modifiers - these are always root level ans start with $
      if (!field.startsWith('$')) {
        if (field.endsWith('$gt')) ref = ref.where(field.replace('.$gt', ''), '>', value);
        else if (field.endsWith('$gte')) ref = ref.where(field.replace('.$gte', ''), '>=', value);
        else if (field.endsWith('$lt')) ref = ref.where(field.replace('.$lt', ''), '<', value);
        else if (field.endsWith('$lte')) ref = ref.where(field.replace('.$lte', ''), '<=', value);
        else {
          ref = ref.where(field, '==', value);
        }
      }
    }

    // apply sorting
    if (this._sort) {
      const orders = Object.entries(this._sort);
      for (let i = 0, len = orders.length; i < len; i++) {
        const field = orders[i][0];
        const direction = orders[i][1];
        ref = ref.orderBy(field, sortMap[direction]);
      }
    }

    // apply projections
    if (this._select) {
      ref = ref.select(...Object.keys(this._select));
    } else {
      // TODO auto generate selections of fields in attributes if schema set to true
      // TODO to improve performance / reduce response size
    }

    return ref;
  }

  /**
   * Validates criteria fields and values
   */
  validateCriteria() {
    const fields = Object.entries(this.criteria);
    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i][0];
      const value = fields[i][1];
      if (!field.startsWith('$')) { // skip modifiers such as $inc
        // TODO should this also check values are of correct type based on model attributes?
        if (!isString(field)) throw new Error(STRINGS.QUERY_FIELD_NAME_INVALID(typeOf(field)));
        if (!isPrimitive(value)) throw new Error(STRINGS.QUERY_FIELD_VALUE_INVALID(typeOf(value)));
      }
    }
  }

  /**
   * Internally flag this query as a findOne document query.
   * @param bool
   * @return {QueryInternal}
   */
  isFindOne(bool) {
    this._isFindOne = !!bool;
    if (this._isFindOne) this._limit = 1;
    return this;
  }

  /**
   *
   * @param deferred
   * @param response
   * @return {*}
   * @private
   */
  _handleQueryResponse(deferred, response) {
    if (this._docId) {
      return deferred._resolve(documentSnapshot.call(this, response));
    }

    return deferred._resolve(querySnapshot.call(this, response));
  }

  /**
   * TODO - single ID works... filter throws error
   * @param onEvent
   * @param onError
   * @returns {*}
   */
  onSnapshot(onEvent, onError) {
    return this.nativeQuery.onSnapshot((snapshot) => {
      if (this._docId) {
        return onEvent(documentSnapshot.call(this, snapshot));
      }

      return onEvent(querySnapshot.call(this, snapshot));
    }, onError);
  }
}

module.exports = QueryInternal;
