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

  get collectionRef() {
    return this.app.firestore().collection(this.collectionName);
  }

  get collectionName() {
    return this.schema.collectionName;
  }

  // TODO methods below need cleaning / api thought through
  findOneByField(field, value) {
    return this.collectionRef.where(field, '==', value).limit(1).get().then((querySnapshot) => {
      return querySnapshot.docs[0] ? querySnapshot.docs[0].data() : undefined;
    });
  }

  findByField(field, value) {
    return this.collectionRef.where(field, '==', value).get().then((querySnapshot) => {
      const out = [];
      // Object.defineProperty(out, 'bar', {
      //   enumerable: false,
      //   value: 'egshdshdh !!!hdfh ',
      // });
      querySnapshot.forEach((snap) => out.push(snap.data()));
      return out;
    });
  }

  find(filter = {}) {
    const fields = Object.keys(filter);

    let query = this.collectionRef;

    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i];
      const value = filter[field];
      query = query.where(field, '==', value);
    }

    return query.get().then((querySnapshot) => {
      const out = [];
      querySnapshot.forEach((snap) => out.push(snap.data()));
      return out;
    });
  }

  findOne(filter = {}) {

    let query = this.collectionRef;

    const fields = Object.keys(filter);

    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i];
      const value = filter[field];
      query = query.where(field, '==', value);
    }

    return query.limit(1).get().then((querySnapshot) => {
      return querySnapshot.docs[0] ? querySnapshot.docs[0].data() : undefined;
    });
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

  findOrCreate() {
  }

  subscribe() {
  }


}

module.exports = Model;
