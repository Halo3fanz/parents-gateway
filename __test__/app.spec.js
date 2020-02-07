const supertest = require('supertest');
const app = require('../app');
const mysql = require('mysql');
/*
beforeAll(async () => {
    app = await require('../app');
})
*/
describe("Testing the app API", () => {
    it("tests database connection", async () => {

        const response = await supertest(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe("true");

    }, 9999);

    it("tests invalid API call", async () => {

        const response = await supertest(app).get('/invalidstring');

        expect(response.status).toBe(404);
        expect(typeof response.error.message).toBe("string");
    });
    
    // Do not run on production database
    it("tests the register students endpoint and a success status", async (done) => {

        const response = await supertest(app).post('/api/register').send({
            teacher: 'teacher1',
            students: ['teststudent', 'teststudent2']
        });

        expect(response.status).toBe(204);
        done();
    });
    
});