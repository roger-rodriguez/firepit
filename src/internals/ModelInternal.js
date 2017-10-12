const Schema = require('../Schema');
const { APPS, UTILS } = require('./');
const { toFirstUpper } = UTILS;
/**
 *
 * @param model
 */
function attachMagicMethods(model) {
  const fields = Object.keys(model.schema.attributes);

  for (let i = 0, len = fields.length; i < len; i++) {
    const field = fields[i];
    const fieldName = toFirstUpper(field);
    const fieldProperties = model.schema.attributes[field]; // todo

    model[`findBy${fieldName}`] = model.findByField.bind(model, field);
    model[`findOneBy${fieldName}`] = model.findOneByField.bind(model, field);
  }
}

class BaseModel {
  constructor(appName, modelName, schema) {
    this.appName = appName;
    this.modelName = modelName;
    this.schema = new Schema(appName, modelName, schema);
    attachMagicMethods(this);
  }

  get app() {
    return APPS[this.appName].app
  }
}

module.exports = BaseModel;
