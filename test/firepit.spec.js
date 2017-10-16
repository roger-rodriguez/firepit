const firepit = require('../src');

describe('firepit', () => {

  it('should export with use method', () => {
    firepit.should.have.property('use').and.be.instanceOf(Function);
  });

});
