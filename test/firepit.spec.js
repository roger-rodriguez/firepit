const firepit = require('../src');

describe('firepit', () => {

  it('should export correctly', () => {
    firepit.should.have.property('config'); // TODO instance of Function doesnt work?
    firepit.should.have.property('model');
  });

});
