const Model = require('./Model');

module.exports = {
  config: function () {

  },
  model: function(name, schema) {
    return new Model(name, schema);
  },
};
