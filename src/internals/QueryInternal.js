const { APPS, DEFAULTS, UTILS } = require('./');

const {
  flatten, isString, isUndefined, isObject, isPrimitive,
} = UTILS;


class QueryInternal {
  /**
   *
   * @param model {Model}
   * @param filterOrString {Object|String}
   * @param possibleValue {undefined|any}
   */
  constructor(model, filterOrString, possibleValue) {
    if (!model.schema._validatedAssociations) {
      model.schema._validateAssociations();
    }

    this._page = 1;
    this._sort = null;
    this._docId = null;
    this._model = model;
    this._reject = null;
    this._resolve = null;
    this._promise = null;
    this._criteria = null;
    this._isFindOne = false;
    this._limit = model.schema.limit;

    // filter object or single id
    if (isUndefined(possibleValue)) {
      if (isString(filterOrString)) this._docId = filterOrString;
      else if (isObject(filterOrString)) this._criteria = Object.assign({}, filterOrString);
      else throw new Error('Invalid arguments provided to Query'); // todo
    } else {
      // single field + value
      if (!isString(filterOrString)) throw new Error('filter field name must be a string'); // TODO
      this._criteria = { [filterOrString]: possibleValue };
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
   * Validates criteria fields and values
   */
  validateCriteria() {
    const fields = Object.entries(this.criteria);
    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i][0];
      const value = fields[i][1];
      if (!field.startsWith('$')) { // skip modifiers such as $inc
        // todo should this also check values are of correct type based on model attributes?
        if (!isString(field)) throw new Error('filter field name must be a string'); // TODO
        if (!isPrimitive(value)) throw new Error('filter value must be one of X Y Z'); // TODO
      }
    }
  }

  /**
   * Internally flag this query as a findOne document query.
   * @param bool
   * @return {QueryInternal}
   */
  isFindOne(bool) {
    this._isFindOne = bool;
    if (this._isFindOne) this._limit = 1;
    return this;
  }

  /**
   * Create a new internal deferred promise, if not already created
   * @private
   */
  _promiseDeferred() {
    if (!this._promise) {
      this._promise = new Promise((resolve, reject) => {
        this._resolve = (result) => {
          this._resolve = null;
          return resolve(result);
        };

        this._reject = (possibleError) => {
          this._reject = null;
          return reject(possibleError);
        };
      });
    }
  }
}

module.exports = QueryInternal;
