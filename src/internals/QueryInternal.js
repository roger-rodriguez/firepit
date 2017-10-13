const { APPS, DEFAULTS, UTILS } = require('./');

const {
  mergeDeep, isString, hasOwnProp,
} = UTILS;


class QueryInternal {
  constructor(model, initialQuery) {
    this._model = model;
    this._initialQuery = initialQuery;
   }


}

module.exports = QueryInternal;
