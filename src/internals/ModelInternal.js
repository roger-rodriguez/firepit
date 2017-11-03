const firebase = require('firebase-admin') // TODO see _touchProperty

const Schema = require('../Schema');
const { APPS, UTILS, STRINGS } = require('./');
const { toFirstUpper, batch, flatten } = UTILS;

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

class ModelInternal {
  /**
   *
   * @param appName
   * @param modelName
   * @param schema
   */
  constructor(appName, modelName, schema) {
    if (APPS[appName].models[modelName]) {
      throw new Error(STRINGS.MODEL_IN_USE(appName, modelName));
    }

    this.appName = appName;
    this.modelName = modelName;
    this.appInternal = APPS[appName];
    this.identity = modelName.toLowerCase();
    this.schema = new Schema(appName, modelName, schema);
    if (schema.autoMagicMethods) attachMagicMethods(this);
  }

  touchCreated(obj) {
    if (this.schema._schema.autoCreatedAt) this.touchCreatedAt(obj);
    if (this.schema._schema.autoCreatedBy) this.touchCreatedBy(obj);
    if (this.schema._schema.autoUpdatedAt) this.touchUpdatedAt(obj);
    if (this.schema._schema.autoUpdatedBy) this.touchUpdatedBy(obj);
  }

  touchUpdated(obj) {
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

  /**
   * Batch deletes by a query
   * @param query
   * @param batchSize
   * @param count
   */
  deleteQueryByBatch(query, batchSize, count = 0) {
    return query.sort('__name__').limit(batchSize)
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
        return this.deleteQueryByBatch(query, batchSize, count);
      });
  }

  /**
   * Batch deletes by an
   * @param ids
   * @param batchSize
   */
  deleteIdsByBatch(ids, batchSize) {
    let index = 0;
    const batches = batch(ids, batchSize);
    const writeBatches = new Array(batches.length);

    // For each batch
    for (let i = 0, len = batches.length; i < len; i++) {
      const batch = this.app.firestore().batch();

      // For each id, add the batch delete
      for (let j = 0, len = batches[i].length; j < len; j++) {
        batch.delete(this.nativeCollection.doc(batches[i][j]));
      }

      writeBatches[i] = batch;
    }

    function commitBatches() {
      if (writeBatches[index]) {
        return writeBatches[index].commit().then(() => {
          index++;

          return commitBatches();
        });
      }

      return Promise.resolve();
    }

    return commitBatches();
  }

  /**
   *
   * @param query
   * @param update
   * @param batchSize
   * @param count
   */
  updateQueryByBatch(query, update, batchSize, count = 0) {
    const flatUpdate = flatten(update);

    return query.limit(batchSize)
      .then((documents) => {
        const length = documents.length;
        if (length === 0) {
          return Promise.resolve();
        }
        count += length;
        const batch = this.app.firestore().batch();
        documents.forEach((doc) => batch.update(doc.ref, flatUpdate));
        return batch.commit().then(() => length);
      })
      .then((numUpdated = 0) => {
        if (numUpdated < batchSize) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          process.nextTick(() => resolve(false));
        });
      })
      .then((complete = true) => {
        if (complete) return Promise.resolve(count);
        return this.updateQueryByBatch(query, update, batchSize, count);
      });
  }
}

module.exports = ModelInternal;

