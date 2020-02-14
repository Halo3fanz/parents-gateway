const supertest = require('supertest');
const app = require('../app');
const express = require('express');
const http = require('http');
const db = require('./../db/db');

describe("Testing the app API", () => {
        
    it("tests database connection", async () => {

        const response = await supertest(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe("true");

    }, 9999);

    it("tests invalid API call", async (done) => {

        const response = await supertest(app).get('/invalidstring');

        expect(response.status).toBe(404);
        expect(typeof response.error.message).toBe("string");
        done();
    });
    
    // Do not run on production database
    it("tests the register students endpoint and a success status", async (done) => {
        //server.get('/api/register').send()
        const response = await supertest(app).post('/api/register').send({
            teacher: 'testteacher1',
            students: ['teststudent', 'teststudent2']
        });

        expect(response.status).toBe(204);
        done();
    });
    
    
    it("tests the common students endpoint and a success status", async (done) => {

        const response =  await supertest(app).get('/api/commonstudents?teacher=testteacher1');

        expect(response.status).toBe(200);
        expect(typeof response.body.students).toBe("object");
        done();
    })
    
});