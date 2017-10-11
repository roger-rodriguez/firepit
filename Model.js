// const deeps = require('deeps');
const firebase = require("firebase-admin");

const serviceAccount = require('./firepit.json');

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

    model[`findBy${fieldName}`] = model._findByField.bind(model, field);
    model[`findOneBy${fieldName}`] = model._findOneByField.bind(model, field);
  }
}

class Model {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    this._collectionRef = firebase.firestore().collection(schema.collectionName);
    magic(this);
  }

  _findOneByField(field, value) {
    return this._collectionRef.where(field, '==', value).limit(1).get().then((querySnapshot) => {
      return querySnapshot.docs[0] ? querySnapshot.docs[0].data() : undefined;
    });
  }

  _findByField(field, value) {
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

  static create(name, schema) {
    return new Model(name, schema);
  }
}

module.exports = Model;
