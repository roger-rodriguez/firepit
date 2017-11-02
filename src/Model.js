const Query = require('./Query');
const { APPS, UTILS, STRINGS } = require('./internals');
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
    return APPS[this.appName].app;
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
   * @param criteria
   * @return {Query}
   */
  find(criteria = {}) {
    return new Query(this, criteria);
  }

  /**
   * Find a single document based on specified criteria.
   * @param criteriaOrString
   * @return {*}
   */
  findOne(criteriaOrString) {
    return new Query(this, criteriaOrString).isFindOne(true);
  }

  /**
   * Find a document by it's id
   * @param id
   * @return {*}
   */
  findOneById(id) {
    if (!isString(id)) throw new Error(STRINGS.INVALID_PARAM_TYPE('findOneById', 'id', 'string', typeOf(id)));
    return new Query(this, id).isFindOne(true);
  }

  /**
   * Finds an existing document by ID or criteria, and creates if it does not exist
   * @param criteriaOrString
   * @param document
   */
  findOrCreate(criteriaOrString, document) {
    if (isObject(criteriaOrString) && hasOwnProp(criteriaOrString, 'id')) {
      return Promise.reject(new Error(STRINGS.CRITERIA_CONTAINS_ID('findOrCreate')));
    }

    return new Query(this, criteriaOrString)
      .isFindOne(true)
      .then((result) => {
        if (result) return result;
        this.touchCreated(result);
        if (isString(criteriaOrString)) Object.assign(document, { id: criteriaOrString });
        return this.create(document);
      });
  }

  /**
   * Create a new document for this model.
   * @param document
   */
  create(document) {
    if (this.schema._schema.autoId && document.id) {
      return Promise.reject(new Error(STRINGS.CREATE_WITH_ID_AND_AUTOID));
    }

    if (!this.schema._schema.autoId && !document.id) {
      return Promise.reject(new Error(STRINGS.CREATE_WITHOUT_ID));
    }

    const id = document.id || generateDocumentId();

    if (!isString(id)) {
      return Promise.reject(new Error(STRINGS.CREATE_INVALID_ID(typeOf(id))));
    }

    return this.findOneById(id)
      .then((exists) => {
        if (exists) {
          return Promise.reject(new Error(STRINGS.CREATE_DOCUMENT_EXISTS(id)));
        }
        return this.validate(document);
      })
      .then((validated) => {
        this.touchCreated(validated);
        return this.nativeCollection.doc(id).set(validated);
      })
      .then(() => {
        return this.findOneById(id);
      });
  }

  /**
   *
   * @param filter
   * @param update
   * @param batchSize
   */
  update(filter, update, batchSize = 50) {
    if (isString(filter)) {
      throw new Error(STRINGS.CRITERIA_CONTAINS_ID('update'));
    }

    return this.validate(update, true)
      .then((validated) => {
        this.touchUpdated(validated);
        return this.updateQueryByBatch(new Query(this, filter || {}), validated, batchSize);
      });
  }

  /**
   *
   * @param id
   * @param document
   */
  updateOne(id, document) {
    if (!isString(id)) {
      return Promise.reject(new Error(STRINGS.INVALID_PARAM_TYPE('updateOne', 'id', 'string', typeOf(id))));
    }

    if (!isObject(document)) {
      return Promise.reject(new Error(STRINGS.INVALID_PARAM_TYPE('updateOne', 'document', 'object', typeOf(document))));
    }

    if (document.id) {
      return Promise.reject(new Error(STRINGS.UPDATE_WITH_ID));
    }

    return this.validate(document, true)
      .then((validated) => {
        this.touchUpdated(validated);
        return this.nativeCollection.doc(id).update(validated);
      })
      .then(() => {
        return this.findOneById(id);
      })
      .catch((error) => {
        if (error.message.includes('no entity to update')) {
          return Promise.resolve(null);
        }
        return Promise.reject(error);
      });
  }

  /**
   * TODO Wont this only work if they have a custom ID?
   * @param obj
   */
  createOrUpdate(obj) {

  }

  /**
   * Returns the firestore collection instance of the Model
   * @returns {*}
   */
  native() {
    return this.nativeCollection;
  }

  /**
   * TODO efficiency?
   * Counts number of records
   * @param criteriaOrString
   * @returns {*}
   */
  count(criteriaOrString = {}) {
    return new Query(this, criteriaOrString).limit(0)
      .then((results) => results.length);
  }

  /**
   * Deletes an entire collection or specific documents by filter
   * @param criteriaOrStringOrArray
   * @param batchSize
   * @returns {*}
   */
  destroy(criteriaOrStringOrArray = null, batchSize = 50) {
    if (isObject(criteriaOrStringOrArray) && criteriaOrStringOrArray.id) {
      return Promise.reject(STRINGS.CRITERIA_CONTAINS_ID('destroy'));
    }

    if (isArray(criteriaOrStringOrArray) && !isArrayOfStrings(criteriaOrStringOrArray)) {
      return Promise.reject(STRINGS.DESTROY_INVALID_ARRAY);
    }

    if (isNull(criteriaOrStringOrArray) || isObject(criteriaOrStringOrArray)) {
      return this.deleteQueryByBatch(new Query(this, criteriaOrStringOrArray || {}), batchSize);
    }

    if (isArrayOfStrings(criteriaOrStringOrArray)) {
      return this.deleteIdsByBatch(criteriaOrStringOrArray, batchSize);
    }

    return this.nativeCollection.doc(criteriaOrStringOrArray).delete();
  }

  /**
   * Subscribes to updates on a document(s)
   * @param criteriaOrString
   * @param onData
   * @param onError
   * @returns {*}
   */
  subscribe(criteriaOrString = {}, onData, onError) {
    return new Query(this, criteriaOrString)
      .onSnapshot(onData, onError);
  }

  /**
   * Validates the pre-document object, throws if invalid or returns the generated output document if valid.
   * @param document
   * @param partial
   */
  validate(document, partial = false) {
    if (!isObject(document)) return Promise.reject(new Error(STRINGS.VALIDATE_INVALID_TYPE(typeOf(document))));

    const mappedDoc = {};
    const attributes = this.schema.schema ? this.schema.attributes : Object.assign(objectToTypeMap(document), this.schema.attributes);
    const entries = Object.entries(attributes);

    const errors = [];

    for (let i = 0, len = entries.length; i < len; i++) {
      const attrName = entries[i][0];
      const attrValue = entries[i][1];

      // Skip attribute check
      if (partial && !hasOwnProp(document, attrName)) continue;

      // skip if the field isn't present and its not required
      if (!hasOwnProp(document, attrName) && !attrValue.required) continue;

      // validate required fields if it full check
      if (!partial && !hasOwnProp(attrValue, 'defaultsTo') && attrValue.required && !hasOwnProp(document, attrName)) {
        errors.push(STRINGS.VALIDATE_MISSING_REQUIRED(attrName));
        continue;
      }

      const value = hasOwnProp(document, attrName) ? document[attrName] : attrValue.defaultsTo;

      // Validate Types

      // if type is 'any' or 'undefined' then skip type checks
      if (attrValue.type !== 'any' && !isUndefined(attrValue.type) && !validateValueForType(value, attrValue.type)) {
        errors.push(STRINGS.VALIDATE_INVALID_ATTRIBUTE_TYPE(attrName, attrValue.type, typeOf(value)));
        continue;
      }

      // Validate Properties
      if ((attrValue.type === 'string' && attrValue.enum) && !attrValue.enum.includes(value)) {
        errors.push(STRINGS.VALIDATE_NOT_ENUM_TYPE(attrName, attrValue.enum, value));
        continue;
      }

      if ((attrValue.type === 'string' && hasOwnProp(attrValue, 'minLength')) && (value.length < attrValue.minLength)) {
        errors.push(STRINGS.VALIDATE_INVALID_MINIMUM_LENGTH(attrName, attrValue.minLength, value.length));
        continue;
      }

      if ((attrValue.type === 'string' && hasOwnProp(attrValue, 'maxLength')) && (value.length > attrValue.maxLength)) {
        errors.push(STRINGS.VALIDATE_INVALID_MAXIMUM_LENGTH(attrName, attrValue.maxLength, value.length));
        continue;
      }

      if (attrValue.validate) {
        const error = attrValue.validate.call(document, value);
        if (error) {
          errors.push(error);
          continue;
        }
      }

      mappedDoc[attrValue.fieldName || attrName] = value;
    }

    if (errors.length) {
      return Promise.reject(new Error(STRINGS.VALIDATE_ERRORS(errors)));
    }

    delete mappedDoc.id;
    return Promise.resolve(mappedDoc);
  }
}

module.exports = Model;
