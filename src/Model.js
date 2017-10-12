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

function validateAttributeType({ type }) {
  if (!type) throw new Error(`Missing attribute type for key "${key}"`);

  const validTypes = ['string', 'integer', 'float', 'datetime', 'boolean', 'binary', 'array', 'json', 'enum'];

  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type "${type}" for key "${key}"`); // todo log model name?
  }
}

function validateTypeValue(type, value) {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') throw new Error('');
      break;
    case 'integer':
      if (value === parseInt(value, 10)) throw new Error('');
      break;
    case 'float':
      // TODO
      break;
    case 'datetime':
      // TODO
      break;
    case 'boolean':
      if (typeof value !== 'boolean') throw new Error('');
      break;
    case 'binary':
      // TODO
      break;
    case 'array': {
      if (!Array.isArray(value)) throw new Error('');
      // for (let i = 0, len = value.length; i < len; i++) {
      //   const item = value[i];
      //   if (typeof item !== 'string' || typeof item !== 'number') throw new Error('');
      // }
      break;
    }
    case 'json':
      // TODO
      break;
    case 'enum': {
      if (!Array.isArray(value)) throw new Error('');
      for (let i = 0, len = value.length; i < len; i++) {
        const item = value[i];
        if (typeof item !== 'string' || typeof item !== 'number') throw new Error('');
      }
      break;
    }
  }
}

function validateAttributes(attributes) {
  if (!attributes) return;

  const keys = Object.keys(attributes);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const attribute = attributes[key];

    validateAttributeType(attribute);
    if (attribute.defaultsTo) validateTypeValue(attribute.type, attribute.defaultsTo); // todo handle 0/null/ etc
  }
}

function schemaDefaults(name, schema = {}) {
  const assigned = Object.assign({}, {
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

  validateAttributes(schema.attributes);

  return assigned;
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
