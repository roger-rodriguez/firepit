module.exports = {

  attributes: {

    name: 'string',

    // many-one

    user: 'integer',

    createdBy: {
      model: 'user'
    }

  }

};
