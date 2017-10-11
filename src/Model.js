// const deeps = require('deeps');
const firebase = require("firebase-admin");

const serviceAccount = require('../firepit.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://firepit-tests.firebaseio.com"
});

function toFirstUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function magic(model) {
  const fields = Object.keys(model.schema.attributes);

  for (let i = 0, len = fields.length; i < len; i++) {
    const field = fields[i];
    const fieldName = toFirstUpper(field);
    const fieldProperties = model.schema.attributes[field]; // todo

    model[`findBy${fieldName}`] = model.findByField.bind(model, field);
    model[`findOneBy${fieldName}`] = model.findOneByField.bind(model, field);
  }
}

function schemaDefaults(name, schema) {
  return Object.assign({}, {
    schema: true,
    app: '[DEFAULT]',
    identity: name.toLowerCase(),
    autoId: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoCreatedBy: true,
    autoUpdatedBy: true,
    collectionName: name.toLowerCase(), // TODO identity vs collectionName
    attributes: {}, // TODO will this deep merge correctly
  }, schema);
}

class Model {

  static create(name, schema) {
    return new Model(name, schema);
  }

  constructor(name, schema) {
    if (!name) throw new Error('name required'); // todo

    this.name = name;
    this.schema = schemaDefaults(name, schema);
    this._collectionRef = firebase.firestore().collection(this.schema.collectionName);
    magic(this);
  }

  findOneByField(field, value) {
    return this._collectionRef.where(field, '==', value).limit(1).get().then((querySnapshot) => {
      return querySnapshot.docs[0] ? querySnapshot.docs[0].data() : undefined;
    });
  }

  findByField(field, value) {
    return this._collectionRef.where(field, '==', value).get().then((querySnapshot) => {
      const out = [];
      // Object.defineProperty(out, 'bar', {
      //   enumerable: false,
      //   value: 'egshdshdh !!!hdfh ',
      // });
      querySnapshot.forEach((snap) => out.push(snap.data()));
      return out;
    });
  }

  find(filter) {
    const fields = Object.keys(filter);

    let query = this._collectionRef;

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

  findOne(filter) {

    let query = this._collectionRef;

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

  updateOne() {
  }

  update() {
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
