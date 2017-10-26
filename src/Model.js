const Query = require('./Query');
const { APPS, UTILS } = require('./internals');
const {
  isObject,
  typeOf,
  isString,
  isNull,
  isArray,
  isArrayOfStrings,
  hasOwnProp,
  isUndefined,
  generateDocumentId,
  tryCatch,
  flatten,
  unflatten,
} = UTILS;
const { validateValueForType } = require('./validate/shared');

const ModelInternal = require('./internals/ModelInternal');

/**
 * Todo move to utils
 * @param doc
 * @return {{}}
 */
function objectToTypeMap(doc) {
  const out = {};
  const entries = Object.entries(doc);

  for (let i = 0, len = entries.length; i < len; i++) {
    const field = entries[i][0];
    const type = typeOf(entries[i][1]);
    out[field] = { type, fieldName: field };
  }

  return out;
}

class Model extends ModelInternal {
  /**
   *
   * @param appName
   * @param modelName
   * @param schemaObj
   */
  constructor(appName, modelName, schemaObj) {
    super(appName, modelName, schemaObj);
  }

  /**
   * Returns the firebase app instance.
   * @return {Object}
   */
  get app() {
    return APPS[this.appName].app
  }

  /**
   * Returns the base CollectionReference for this model
   * @return {*}
   */
  get nativeCollection() {
    return this.app.firestore().collection(this.collectionName);
  }

  /**
   * Returns the name of the firestore collection for this model
   * @return {*}
   */
  get collectionName() {
    return this.schema.collectionName;
  }

  /**
   *
   * @param field
   * @param value
   * @return {*}
   */
  findOneByField(field, value) {
    return new Query(this, field, value).isFindOne(true);
  }

  /**
   *
   * @param field
   * @param value
   * @return {Query}
   */
  findByField(field, value) {
    return new Query(this, field, value);
  }

  /**
   * Find one or more documents.
   * @param filter
   * @return {Query}
   */
  find(filter = {}) {
    return new Query(this, filter);
  }

  /**
   * Find a single document based on specified criteria.
   * @param filterOrString
   * @return {*}
   */
  findOne(filterOrString) {
    return new Query(this, filterOrString).isFindOne(true);
  }

  /**
   * Find a document by it's id
   * @param id
   * @return {*}
   */
  findOneById(id) {
    if (!isString(id)) throw new Error('id for findOneById must be a string'); // todo
    return new Query(this, id).isFindOne(true);
  }

  /**
   * Validates the pre-document object, throws if invalid or returns the generated output document if valid.
   * @param obj
   * TODO If partial (update) then ignore required field
   */
  validate(obj) {
    if (!isObject(obj)) return Promise.reject(new Error('document must be an object'));

    const mappedDoc = {};
    const attributes = this.schema.schema ? this.schema.attributes : Object.assign(objectToTypeMap(obj), this.schema.attributes);
    const entries = Object.entries(attributes);

    for (let i = 0, len = entries.length; i < len; i++) {
      const attrName = entries[i][0];
      const attrValue = entries[i][1];

      // validate required fields
      if (!hasOwnProp(attrValue, 'defaultsTo') && attrValue.required && !hasOwnProp(obj, attrName)) {
        return Promise.reject(new Error(`missing required attr ${attrName}`));
      }

      const value = hasOwnProp(obj, attrName) ? obj[attrName] : attrValue.defaultsTo;

      // Validate Types

      // if type is 'any' or 'undefined' then skip type checks
      if (attrValue.type !== 'any' && !isUndefined(attrValue.type) && !validateValueForType(value, attrValue.type)) {
        return Promise.reject(new Error(`Attr '${attrName}' has invalid type, expected '${attrValue.type}' got '${typeOf(value)}'`));
      }

      // Validate Properties
      if ((attrValue.type === 'string' && attrValue.enum) && !attrValue.enum.includes(value)) {
        return Promise.reject(new Error(`Attr '${attrName}' has invalid value, expected one of ${attrValue.enum.join(', ')} got ${value}`));
      }

      if ((attrValue.type === 'string' && hasOwnProp(attrValue, 'minLength')) && (value.length < attrValue.minLength)) {
        return Promise.reject(new Error(`Attr '${attrName}' has invalid value, expected minimum length of ${attrValue.minLength} but got length of ${value.length}`));
      }

      if ((attrValue.type === 'string' && hasOwnProp(attrValue, 'maxLength')) && (value.length > attrValue.maxLength)) {
        return Promise.reject(new Error(`Attr '${attrName}' has invalid value, expected maximum length of ${attrValue.maxLength} but got length of ${value.length}`));
      }

      if (attrValue.validate) {
        const error = tryCatch(attrValue.validate.bind(obj, value));
        if (error) return Promise.reject(error);
      }

      mappedDoc[attrValue.fieldName || attrName] = value;
    }

    delete mappedDoc.id;
    return Promise.resolve(mappedDoc);
  }

  /**
   * Create a new document for this model.
   * @param obj
   */
  create(obj) {
    const id = obj.id || generateDocumentId();
    return this.validate(obj)
      .then((validated) => {
        this.touchCreated(validated);
        return this.nativeCollection.doc(id).set(validated);
      })
      .then(() => {
        return this.findOneById(id);
      });
  }


  /**
   * Finds an existing document by ID or criteria, and creates if it does not exist
   * @param filterOrString
   * @param document
   */
  findOrCreate(filterOrString, document) {
    if (isObject(filterOrString) && filterOrString.id) {
      return Promise.reject(new Error('Given criteria cannot contain an id key. Use .findOrCreate(id <-- unique ID'));
    }

    return new Query(this, filterOrString)
      .isFindOne(true)
      .then((result) => {
        if (result) return result;
        this.touchCreated(result);
        if (isString(filterOrString)) Object.assign(document, { id: filterOrString });
        return this.create(document);
      })
  }

  /**
   *
   * @param id
   * @param update
   */
  updateOne(id, update) {
    if (!isString(id)) {
      return Promise.reject(new Error('ID must be a string'));
    }

    if (!isObject(obj)) {
      return Promise.reject(new Error('update must be an object'));
    }

    if (update.id) {
      return Promise.reject(new Error('update cannot contain ID field'));
    }

    return this.nativeCollection.doc(id).get()
      .then((toUpdate) => {
        if (!toUpdate.exists) {
          return Promise.resolve(null);
        }
        // flatten and merge
        const merged = Object.assign(flatten(toUpdate), flatten(update));
        return this.validate(unflatten(merged));
      })
      .then((validated) => {
        if (!validated) return Promise.resolve(null);
        this.touchUpdated(validated);
        return this.nativeCollection.doc(id).update(validated);
      });
  }

  createOrUpdate() {
    // TODO set with merge
  }

  /**
   * Returns the firestore collection instance of the Model
   * @returns {*}
   */
  native() {
    return this.nativeCollection;
  }

  /**
   * TODO needs to be more efficient using select - need to figure out what can be selected though - does orderBy __name__ make it quicker?
   * Counts number of records
   * @param filterOrString
   * @returns {*}
   */
  count(filterOrString = {}) {
    return new Query(this, filterOrString).limit(0)
      .then((results) => results.length);
  }

  update(where, object) {
    // partial validate,  GET -> batch set
  }

  /**
   * Deletes an entire collection or specific documents by filter
   * @param filterOrStringOrArray
   * @param batchSize
   * @returns {*}
   */
  destroy(filterOrStringOrArray = null, batchSize = 50) {
    if (isObject(filterOrStringOrArray) && filterOrStringOrArray.id) {
      return Promise.reject('Given criteria cannot contain an id key. Use .destroy(id <-- unique ID');
    }

    if (isArray(filterOrStringOrArray) && !isArrayOfStrings(filterOrStringOrArray)) {
      return Promise.reject('Given array must be an array of string IDs');
    }

    if (isNull(filterOrStringOrArray) || isObject(filterOrStringOrArray)) {
      return this.deleteQueryByBatch(new Query(this, filterOrStringOrArray || {}), batchSize);
    }

    if (isArrayOfStrings(filterOrStringOrArray)) {
      return this.deleteIdsByBatch(filterOrStringOrArray, batchSize);
    }

    return this.nativeCollection.doc(filterOrString).delete();
  }
}

module.exports = Model;
