const JOIN_TYPES = {
  one2one: true,
  one2many: true,
  oneWay: true,
  many2many: true,
};

function getJoinType(association) {
  if (association.hasOne && !association.via) {
    // one to many OR one way association
    const otherModelAssocs = Object.values(association.model.schema._associations);

    // check for pairing hasMany join
    let hasMany = false;
    for (let i = 0, len = otherModelAssocs.length; i < len; i++) {
      const otherModelAssoc = otherModelAssocs[i];
      if (otherModelAssoc.hasMany && otherModelAssoc.via === association.fieldName) {
        hasMany = true;
        break;
      }
    }

    return hasMany ? 'one2many' : 'oneWay';
  }

  if (association.hasOne && association.via) return 'one2one';
  if (association.hasMany && association.via) return 'many2many';

  // TODO
  throw new Error('Invalid model association.');
}

class Associations {
  constructor(appInternal) {
    this._matrix = {};
    this._app = appInternal;
  }

  /**
   *
   * @param model
   */
  setAssociationsForModel(model) {
    const associationsWithJoin = {};
    const associations = Object.values(model.schema._associations);

    for (let i = 0, len = associations.length; i < len; i++) {
      const association = associations[i];
      associationsWithJoin[association.fieldName] = {
        ...association,
        join: getJoinType(association),
      };
    }

    this._matrix[model.modelName] = associationsWithJoin;
  }

  /**
   *
   * @param modelName
   * @return {boolean}
   */
  modelHasJoins(modelName) {
    return !!this._matrix[modelName];
  }

  /**
   *
   * @param fieldName
   * @param modelName
   * @return {*}
   */
  getFieldForModel(fieldName, modelName) {
    if (!this._matrix[modelName] || this._matrix[modelName][fieldName]) return null;
    return this._matrix[modelName][fieldName];
  }
}


module.exports = Associations;
