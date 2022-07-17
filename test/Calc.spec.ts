import * as request from 'supertest';
import * as chai from 'chai';
import * as server from '../src/App';

const { expect } = chai;
const should = chai.should();

describe('Calculator', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('sum', (done) => {
    request(server)
      .post('/api/calculator/sum')
      .send({
        x: 2,
        y: 3,
      })
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.have.property('sum');
        res.body.sum.should.be.equal(5);
        done();
      });
  });
});
