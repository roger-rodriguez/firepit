function toFirstUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function attachMagicMethods(model) {
  const fields = Object.keys(model.schema.attributes);

  for (let i = 0, len = fields.length; i < len; i++) {
    const field = fields[i];
    const fieldName = toFirstUpper(field);
    const fieldProperties = model.schema.attributes[field]; // todo

    model[`findBy${fieldName}`] = model.findByField.bind(model, field);
    model[`findOneBy${fieldName}`] = model.findOneByField.bind(model, field);
  }
}

function validateAttributeType(modelName, key, attribute) {
  if (!attribute.type) throw new Error(`Missing attribute type for key "${key}"`);

  const validTypes = ['string', 'email', 'integer', 'float', 'datetime', 'boolean', 'binary', 'array', 'json'];

  if (!validTypes.includes(attribute.type)) {
    throw new Error(`Invalid type "${attribute.type}" for key "${key}" on "${modelName}" model`); // todo log model name?
  }
}

function validateTypeValue(type, value) {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') throw new Error('');
      break;
    case 'email':

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

function validateAttributes(modelName, attributes) {
  if (!attributes) return;

  const keys = Object.keys(attributes);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const attribute = attributes[key];

    validateAttributeType(modelName, key, attribute);
    if (attribute.defaultsTo) validateTypeValue(attribute.type, attribute.defaultsTo); // todo handle 0/null/ etc
  }
}



const BaseModel = require('./BaseModel');

class Model extends BaseModel {

  constructor(appName, modelName) {
    super(appName, modelName);
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

  findOne(filter = {}) {

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
