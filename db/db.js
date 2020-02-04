'use strict'
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tadb'
});

exports.getTeachers = function(callback) {
    var sql = "SELECT * FROM teachers";
    pool.getConnection(function(err, connection) {
        if (err) { console.log(err);  callback(true); return; }
        // make the query
        connection.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, rows);
        });
    });
}

exports.registerStudents = ((teacher, students, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        var sql = "INSERT INTO tadb.classes(teacher_email, student_email) VALUES ?";
        // bulk insert students
        var values = [];
        for (var student in students) {
            values.push([teacher, students[student]]);
        }
        
        connection.query(sql, [values], (err, result) => {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        });
    });



    /*
    var sql = "INSERT INTO tadb.teachers(email) VALUES(\'" + teacher + "\')";
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Get Connection: " + err);
            callback(true);
            return;
        }
        connection.query(sql, (err, rows) => {
            if (err) {
                console.log("Query: " + err);
                callback(true);
                return;
            }
            callback(false, rows);
        });
    }); */
});

