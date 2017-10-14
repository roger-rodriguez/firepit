const Query = require('./Query');
const { APPS } = require('./internals');
const ModelInternal = require('./internals/ModelInternal');

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
  get collectionRef() {
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
   *
   * @param filter
   * @return {Query}
   */
  find(filter = {}) {
    return new Query(this, filter);
  }

  /**
   *
   * @param filterOrString
   * @return {*}
   */
  findOne(filterOrString) {
    return new Query(this, filterOrString).isFindOne(true);
  }

  findOrCreate(filterOrString, document) {

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

  create() {
  }

  destroy() {
  }



  subscribe() {
  }


}

module.exports = Model;
