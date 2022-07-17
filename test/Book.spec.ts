/**
 *
 *
 *
 */
import * as request from 'supertest';
import * as chai from 'chai';
import * as server from '../src/App';

const { expect } = chai;
const should = chai.should();

describe('Book Management', () => {
  const defaultPassword = '1234@1234';
  let validToken: string = '';
  const invalidToken: string = '123456';
  before((done) => {
    // Login and get token
    const user = {
      username: 'unittest1478801042866@gmail.com',
      password: defaultPassword,
    };
    request(server)
      .post('/api/authentication/signinwithusernameandpassword')
      .send(user)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        validToken = res.body.auth.token;
        done();
      });
  });
  afterEach(() => {
  });

  describe('Add new Book', () => {
    const apiUrl = '/api/book/add';

    it('should return InvalidToken Error trying to add book with invalid token', (done) => {
      const book = {
        author: 'Gang of Four',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        year: 1998,
      };
      request(server)
        .post(apiUrl)
        .send(book)
        .set({ Authorization: invalidToken })
        .end((err, res) => {
          res.status.should.be.equal(403);
          done();
        });
    });

    it('should return book id trying to add sucessfully', (done) => {
      const book = {
        author: 'Gang of Four',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        year: 1998,
      };
      request(server)
        .post(apiUrl)
        .send(book)
        .set({ Authorization: validToken })
        .end((err, res) => {
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('Search book', () => {
    const apiUrl = '/api/book/getbyauthor';

    it('should return book array trying to get book by author', (done) => {
      request(server)
        .post(apiUrl)
        .send({
          author: 'Gang of Four',
        })
        .end((err, res) => {
          res.status.should.be.equal(200);
          done();
        });
    });
  });
});
