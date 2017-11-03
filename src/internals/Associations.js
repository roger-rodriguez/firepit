const Model = require('../Model');

const JOIN_TYPES = {
  one2one: true,
  one2many: true,
  oneWay: true,
  many2many: true,
};

function getJoinType(association) {
  if (association.hasOne && association.via) return 'one2one';
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

    if (hasMany && !association.via) return 'many2one';
    return hasMany ? 'one2many' : 'oneWay';
  }

  if (association.hasMany && association.via) {
    // one to many OR one way association
    const otherModelAssoc = association.model.schema._associations[association.via];

    // check for pairing hasOne join
    const hasOne = otherModelAssoc.hasOne && !otherModelAssoc.via;
    if (hasOne && association.via) return 'many2one';
    return hasOne ? 'one2many' : 'many2many';
  }

  // TODO
  throw new Error('Invalid model association.');
}

function getJoinModelName(str1, str2) {
  return [str1, str2].sort((a, b) => a.localeCompare(b)).join('-');
}

class Associations {
  constructor(appInternal) {
    this._matrix = {};
    this._internalModels = {};
  }

  /**
   *
   * @param currentModelName
   * @param association
   * @return {*}
   */
  getJoinModel(currentModelName, association) {
    const name = getJoinModelName(`${association.hasMany}_${association.via}`, `${currentModelName}_${association.fieldName}`);
    return this._internalModels[name];
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
      const join = getJoinType(association);
      associationsWithJoin[association.fieldName] = {
        ...association,
        join,
      };

      if (join === 'many2many') {
        const name = getJoinModelName(`${association.hasMany}_${association.via}`, `${model.modelName}_${association.fieldName}`);
        this._internalModels[name] = new Model(model.appName, name, {
          attributes: {
            [association.hasMany]: 'string',
            [model.modelName]: 'string',
          },
          autoMagicMethods: false,
          autoUpdatedAt: false,
          autoCreatedBy: false,
          autoUpdatedBy: false,
        });
      }
    }

    this._matrix[model.modelName] = associationsWithJoin;
  }

  /**
   *
   * @param fieldName
   * @param modelName
   * @return {*}
   */
  getFieldForModel(fieldName, modelName) {
    if (!this._matrix[modelName] || !this._matrix[modelName][fieldName]) return null;
    return this._matrix[modelName][fieldName];
  }
}


module.exports = Associations;
