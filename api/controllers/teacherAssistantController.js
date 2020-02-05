'use strict';

var mysql = require('mysql'),
    Teacher = mysql.model('Teachers');

exports.list_all_teachers = function(req, res) {
    Teacher.find({}, function(err, teacher) {
        if (err) {
            res.send(err);
        }
        res.json(teacher);
    });
};

exports.register_teacher = function(req, res) {
    var new_teacher = new Teacher(req.body);
    new_teacher.save(function(err, teacher) {
        if (err) {
            res.send(err);
        }
        res.json(teacher);
    });
};