'use strict';

const express = require('express');
const router = express.Router();

const teachers = require('./../../data/teachers');
//const register = require('../register');

// handle incoming request to /users
/*
router.get('/', (req, res, next) => {
    res.status(200).json({
       teachers: teachers
    });
});
*/
/*
module.exports = function(app) {
    var teachersList = require('../controllers/teacherAssistantController');

    // teachersList routes
    app.route('/api/register')
        .get(teachersList.list_all_teachers)
        .post(teachersList.register_teacher);
}
*/
var db = require('./../../db/db');

router.get('/', (req, res, next) => {
    db.getTeachers((err, results) => {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send(results);
    });
});

// User Story 1
router.post('/api/register', (req, res, next) => {
    if (!req.body.teacher) {
        return res.status(400).send({
            success: 'false',
            message: 'teacher email is required'
        });
    } else if (!req.body.students) {
        return res.status(400).send({
            success: 'false',
            message: 'students are required'
        });
    }
    const teacherList = {
        teacher: req.body.teacher,
        students: req.body.students
    }
    //register.push(teacherList);

    // Send register to database
    db.registerStudents(teacherList.teacher, teacherList.students, (err, results) => {
        if (err) {
            res.status(500).send({
                success: 'false',
                message: 'Server Error'
            });
            return;
        }
        //res.status(204);

        res.status(204).send({
            success: 'true',
            message: 'teacher registered successfully',
            teacherList
        });
    });
});

// User Story 2



module.exports = router;