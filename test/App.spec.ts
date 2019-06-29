import * as server from '../src/App'
import * as request from 'supertest'
import * as chai from 'chai'
const expect = chai.expect
const should = chai.should()

describe('loading express', () => {
  it('responds to /', (done) => {
    request(server)
            .get('/')
            .expect(200, done)
  })
  it('404 everything else', (done) => {
    request(server)
            .get('/foo/bar')
            .expect(404, done)
  })
})
