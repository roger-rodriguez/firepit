const documentSnapshot = require('./documentSnapshot');

module.exports = function querySnapshot(query, querySnapshot, singular) {
  const out = [];
  const docs = querySnapshot.docs || [];

  for (let i = 0, len = docs.length; i < len; i++) {
    out.push(documentSnapshot(query._model, docs[i]));
  }

  Object.defineProperties(out, {
    empty: {
      enumerable: false,
      value: querySnapshot.empty,
    },
    query: {
      enumerable: false,
      value: query.nativeQuery,
    },
    changes: {
      enumerable: false,
      value: querySnapshot.docChanges,
    },
  });

  if (singular) return out[0] || null;
  return out;
};

