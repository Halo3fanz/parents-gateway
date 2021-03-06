'use strict';

const express = require('express');
const router = express.Router();

const teachers = require('./../../data/teachers');

var db = require('./../../db/db');

// For testing connection
router.get('/', (req, res, next) => {
   res.status(200).send( {
       success: 'true',
       message: 'Server Endpoint established'
   })
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

    // Send register to database
    db.registerStudents(teacherList.teacher, teacherList.students, (err, results) => {
        if (err) {
            res.status(500).send({
                success: 'false',
                message: 'Server Error'
            });
            return;
        }

        res.status(204).send({
            success: 'true',
            message: 'teacher registered successfully',
            teacherList
        });
    });
});

// Retrieve a list of all common students to a given list of teachers
router.get('/api/commonstudents', (req, res, next) => {
    if(req.query.teacher === undefined) {
        return res.status(400).send( {
            success: 'false',
            message: 'teacher email is required'
        });
    }

    // Route to single query if only one teacher
    if ((typeof req.query.teacher) === "string") {    
        db.getCommonStudent(req.query.teacher, (err, results) => {
            if (err) {
                return res.status(500).send({
                    success: 'false',
                    message: 'Server Error'
                });
            }
            res.status(200).send(results);
        });

    } else {
        db.getCommonStudents(req.query.teacher, (err, results) => {
            if (err) {
                return res.status(500).send({
                    success: 'false',
                    message: 'Server Error'
                });
            }
            res.status(200).send(results);

        });
    }
});

router.post('/api/suspend', (req, res, next) => {
    if (!req.body.student) {
        return res.status(400).send({
            success: 'false',
            message: 'student email is required'
        });
    }
    
    db.suspendStudent(req.body.student, (err) => {
        if (err) {
            return res.status(500).send({
                success: 'false',
                message: 'Server Error'
            });
        }
        res.status(204).send();
    });

});

router.post('/api/retrievefornotifications', (req, res, next) => {
    if (!req.body.teacher) {
        return res.status(400).send({
            success: 'false',
            message: 'teacher email is required'
        });
    } else if (!req.body.notification) {
        return res.status(400).send({
            success: 'false',
            message: 'notification message required'
        });
    }

    var mentionedStudents = getMentionedStudents(req.body.notification);

    db.notifyStudents(req.body.teacher, mentionedStudents, (err, results) => {
        if (err) {
            return res.status(500).send({
                success: 'false',
                message: 'Server Error'
            });
        }
        res.status(200).send(results);
    });

});

function getMentionedStudents (msg) {
    var arr = [];
    var words = msg.split(" ");
    
    for (var word of words) {
        if (word[0] == "@") { // ECMAScript 5
            arr.push(word.slice(1));
        } 
    }
    return arr;
}

module.exports = router;