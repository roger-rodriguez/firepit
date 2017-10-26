const firepit = require('../../src');

describe('firepit module', () => {

  it('should export with use method', () => {
    firepit.should.have.property('use').and.be.instanceOf(Function);
    firepit.should.have.property('deleteInstance').and.be.instanceOf(Function);
  });

});
