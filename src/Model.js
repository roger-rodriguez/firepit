const Query = require('./Query');
const { APPS, UTILS } = require('./internals');
const { isObject, typeOf, isString, hasOwnProp, isUndefined, generateDocumentId } = UTILS;
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
   * @return {{}}
   */
  validate(obj) {
    if (!isObject(obj)) throw new Error('document must be an object'); ///todo

    const mappedDoc = {};
    const attributes = this.schema.schema ? this.schema.attributes : Object.assign(objectToTypeMap(obj), this.schema.attributes);
    const entries = Object.entries(attributes);

    for (let i = 0, len = entries.length; i < len; i++) {
      const attrName = entries[i][0];
      const attrValue = entries[i][1];

      // validate required fields
      if (!hasOwnProp(attrValue, 'defaultsTo') && attrValue.required && !hasOwnProp(obj, attrName)) {
        throw new Error(`missing required attr ${attrName}`); // todo
      }

      const value = hasOwnProp(obj, attrName) ? obj[attrName] : attrValue.defaultsTo;

      // validate types
      // if type is 'any' or 'undefined' then skip type checks
      if (attrValue.type !== 'any' && !isUndefined(attrValue.type) && !validateValueForType(value, attrValue.type)) {
        throw new Error(`Attr '${attrName}' has invalid type, expected '${attrValue.type}' got '${typeOf(value)}'`); // todo
      }

      // todo any custom validators e.g min/maxvalue or validator functions
      // todo created at / updated at auto fields

      mappedDoc[attrValue.fieldName || attrName] = value;
    }

    delete mappedDoc.id;
    return mappedDoc;
  }

  /**
   * Create a new document for this model.
   * @param obj
   */
  create(obj) {
    const id = obj.id || generateDocumentId();
    // todo promise.reject failed validation rather than throw? maybe this.validate().then.doc().set()
    return this.nativeCollection.doc(id)
      .set(this.validate(obj))
      // todo find should map custom fieldNames back to the correct attribute names
      .then(() => this.findOneById(id));
  }


  /**
   * TODO is always creating for some reason
   * @param filterOrString
   * @param document
   * @return {*|Promise|Promise.<TResult>}
   */
  findOrCreate(filterOrString, document) {
    return new Query(this, filterOrString)
      .isFindOne(true)
      .then((result) => {
        if (result) return result;
        else return this.create(document);
      })
  }

  createOrUpdate() {
  }

  native() {
  }

  count() {
  }

  updateOne(id, obj) {
  }

  update(id, object) {
  }


  destroy() {
  }


  subscribe() {
  }


}

module.exports = Model;
