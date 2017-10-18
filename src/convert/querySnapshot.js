const documentSnapshot = require('./documentSnapshot');

module.exports = function querySnapshot(querySnapshot) {
  const out = [];
  const docs = querySnapshot.docs || [];

  for (let i = 0, len = docs.length; i < len; i++) {
    out.push(documentSnapshot.call(this, docs[i]));
  }

  Object.defineProperties(out, {
    empty: {
      enumerable: false,
      value: querySnapshot.empty,
    },
    query: {
      enumerable: false,
      value: this.nativeQuery,
    },
    changes: {
      enumerable: false,
      value: querySnapshot.docChanges,
    },
  });

  if (this._isFindOne) return out[0] || null;
  return out;
};

