const firebase = require('firebase-admin') // TODO see _touchProperty

const Schema = require('../Schema');
const { UTILS } = require('./');
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
    // const fieldProperties = model.schema.attributes[field]; // todo
    // // TODO should transform fields like first_name to work like: findByFirstName - no underscores
    model[`findBy${fieldName}`] = model.findByField.bind(model, field);
    model[`findOneBy${fieldName}`] = model.findOneByField.bind(model, field);
  }
}

class BaseModel {
  /**
   *
   * @param appName
   * @param modelName
   * @param schema
   */
  constructor(appName, modelName, schema) {
    this.appName = appName;
    this.modelName = modelName;
    this.schema = new Schema(appName, modelName, schema);
    attachMagicMethods(this);
  }

  touch(obj) {
    if (this.schema._schema.autoCreatedAt) this.touchCreatedAt(obj);
    if (this.schema._schema.autoCreatedBy) this.touchCreatedBy(obj);
    if (this.schema._schema.autoUpdatedAt) this.touchUpdatedAt(obj);
    if (this.schema._schema.autoUpdatedBy) this.touchUpdatedBy(obj);
  }

  _touchProperty(obj, property) {
    // TODO Need to use the import of firebase its not attached to the instance...
    obj[property] = firebase.firestore.FieldValue.serverTimestamp();
  }

  touchCreatedAt(obj) {
    this._touchProperty(obj, 'createdAt');
  }

  touchCreatedBy(obj) {
    obj.createdBy = '_SERVER_'; // TODO when needed
  }

  touchUpdatedAt(obj) {
    this._touchProperty(obj, 'updatedAt');
  }

  touchUpdatedBy(obj) {
    obj.updatedBy = '_SERVER_'; // TODO when needed
  }

  // deleteCollection(batchSize = 10) {
  //   return this._deleteQueryBatch(this.nativeCollection.limit(batchSize));
  // }

  deleteQueryByBatch(query, batchSize, count = 0) {
    return query.limit(batchSize)
      .then((documents) => {
        const length = documents.length;
        if (length === 0) {
          return Promise.resolve();
        }
        count += length;
        const batch = this.app.firestore().batch();
        documents.forEach((doc) => batch.delete(doc.ref));
        return batch.commit().then(() => length);
      })
      .then((numDeleted = 0) => {
        if (numDeleted < batchSize) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          process.nextTick(() => resolve(false));
        });
      })
      .then((complete = true) => {
        if (complete) return Promise.resolve(count);
        return this.deleteQueryByBatch(query, batchSize, count)
      });
  }
}

module.exports = BaseModel;

