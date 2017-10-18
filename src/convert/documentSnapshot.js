module.exports = function documentSnapshot(documentSnapshot) {
  if (!documentSnapshot || !documentSnapshot.exists) return null;

  const model = this._model;
  const schema = model.schema.schema;

  const out = { id: documentSnapshot.id };
  const data = documentSnapshot.data();
  const attributes = Object.keys(schema ? model.schema.attributes : Object.assign({}, data, model.schema.attributes));

  for (let i = 0, len = attributes.length; i < len; i++) {
    if (this._select && this._select[attributes[i]]) {
      out[attributes[i]] = data[attributes[i]];
    } else if (!this._select) {
      out[attributes[i]] = data[attributes[i]];
    }
  }

  Object.defineProperties(out, {
    ref: {
      enumerable: false,
      value: model.nativeCollection.doc(out.id),
    },
    model: {
      enumerable: false,
      value: model,
    },
    // should
    save: {
      enumerable: false,
      value: (function save() {
        const id = out.id;
        // todo only update changes and not whole doc?
        // todo use firestore.FieldValue.delete() for deleted keys
        // todo update updateAt timestampValue
        delete out.id;
        return model.updateOne(id, out);
      }).bind(out),
    },
    destroy: {
      enumerable: false,
      value: (function destroy() {
        return model.destroy(out.id);
      }).bind(out),
    },
  });

  // todo attach virtual attributes

  return out;
};

