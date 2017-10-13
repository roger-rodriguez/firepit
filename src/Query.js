const QueryInternal = require('./internals/QueryInternal');


class Query extends QueryInternal {
  constructor(model, initialQuery) {
    super(model, initialQuery);
  }
}

module.exports = Query;
