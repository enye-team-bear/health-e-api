const supertest = require('supertest');
const api = require('../index');

const request = supertest.agent(api);

describe('User Endpoints', () => {
    it('should return moses', done => {
        request
            .get('/')
            .expect(404)
            .then(res => {
                expect(res.statusCode).toEqual(404);
                expect(res.text).toEqual('moses');
                done();
            });
    });
});
