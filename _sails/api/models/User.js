module.exports = {

  attributes: {

    name: 'string',

    // one-many
    posts: {
      collection: 'post',
      via: 'user'
    },

    // one-one
    device: {
      model: 'device',
    }

  }

};
