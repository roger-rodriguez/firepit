const { APPS, DEFAULTS, UTILS } = require('./');

const {
  mergeDeep, isString, hasOwnProp,
} = UTILS;


class QueryInternal {
  constructor(model, initialCriteria) {
    if (!model.schema._validatedAssociations) {
      model.schema._validateAssociations();
    }

    this._page = 1;
    this._sort = null;
    this._model = model;
    this._reject = null;
    this._resolve = null;
    this._promise = null;
    this._limit = model.schema.limit;
    this._criteria = initialCriteria || {};
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
