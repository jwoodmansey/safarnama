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

describe('Authentication', () => {
  const timestamp = new Date().getTime();
  const defaultPassword = '1234@1234';

  describe('User SignUp with Username & Password', () => {
    const apiUrl = '/api/authentication/signupwithusernameandpassword';

    it('should return user object trying to register sucessfully', (done) => {
      const user = {
        username: `unittest${timestamp}@gmail.com`,
        password: defaultPassword,
      };
      request(server)
        .post(apiUrl)
        .send(user)
        .end((err: any, res: any) => {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(200);
          done();
        });
    });

    it('should return "UserExistsError" trying to register with existing username', (done) => {
      const user = {
        username: `unittest${timestamp}@gmail.com`,
        password: defaultPassword,
        fullname: 'salonhelps',
      };
      request(server)
        .post(apiUrl)
        .send(user)
        .end((err: any, res: any) => {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(409);
          res.body.should.have.property('err');
          res.body.err.name.should.be.equal('UserExistsError');
          done();
        });
    });
  });

  describe('User Signin with Username & Password', () => {
    const apiUrl = '/api/Authentication/signinwithusernameandpassword';

    it('should return "SignInFailed" error trying to Signin wrong password or username', (done) => {
      const user = {
        username: 'test@salonhelps.com',
        password: defaultPassword,
      };
      request(server)
        .post(apiUrl)
        .send(user)
        .end((err: any, res: any) => {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(403);
          res.body.should.have.property('err');
          res.body.err.should.be.equal('SignInFailed');
          done();
        });
    });

    it('should return user & auth object trying to Signin sucessfully', (done) => {
      const user = {
        username: `unittest${timestamp}@gmail.com`,
        password: defaultPassword,
      };
      request(server)
        .post(apiUrl)
        .send(user)
        .end((err: any, res: any) => {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(200);
          res.body.should.have.property('user');
          res.body.user.username.should.be.equal(user.username);
          res.body.should.have.property('auth');
          res.body.auth.should.have.property('token');
          done();
        });
    });
  });
});
