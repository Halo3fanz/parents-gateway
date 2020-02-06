'use strict'
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tadb',
    multipleStatements: true
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
});

exports.getCommonStudent = ((teacher, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }

        var sql = "SELECT DISTINCT student_email FROM tadb.classes";
        sql += " WHERE teacher_email = " + "\'" + teacher + "\'";

       connection.query(sql, (err, rows) => {
           if(err) {
               console.log(err);
               callback(true);
               return;
           }
           
           var o = {};
           var key = "students";
           o[key] = [];

           for(var row of rows) {
               o[key].push(row.student_email);
           }

           callback(false, o);
       })
    });
});


exports.getCommonStudents = ((teachers, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }

        var sql = "CREATE TEMPORARY TABLE IF NOT EXISTS tadb.C AS "
            + "SELECT DISTINCT A.student_email "
            + "FROM tadb.classes AS A " 
            + "INNER JOIN tadb.classes AS B "
            + "ON A.student_email = B.student_email "
            + "AND A.teacher_email = " + connection.escape(teachers[0]) + " "
            + "AND B.teacher_email = " + connection.escape(teachers[1]) + ";";

        var tables = ["C"];
        var char = "D";
        if (teachers.length > 2) {
            for (var i = 2; i < teachers.length; i++) {
                sql += "CREATE TEMPORARY TABLE IF NOT EXISTS tadb." + char + " AS "
                + "SELECT DISTINCT A.student_email "
                + "FROM tadb.classes AS A " 
                + "INNER JOIN tadb." + tables[tables.length-1] + " AS B "
                + "ON A.student_email = B.student_email "
                + "AND A.teacher_email = " + connection.escape(teachers[i]) + ";";
                tables.push(char);
                char = nextChar(char);
            }
        }
        sql += "SELECT * FROM tadb." + tables[tables.length-1] +";"

        for (var j = 0; j < tables.length; j++) {
            sql += "DROP TEMPORARY TABLE tadb." + tables[j] + ";";
        }
        
       connection.query(sql, (err, result) => {
           if(err) {
               console.log(err);
               callback(true);
               return;
           }
           var rows = result[result.length - tables.length - 1];
           console.log(rows);
           var o = {};
           var key = "students";
           o[key] = [];

           for(var row of rows) {
               o[key].push(row.student_email);
           }
           callback(false, o);
       });
    });
});

exports.suspendStudent = ((student, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }

        var sql = "UPDATE tadb.classes"
        + " SET suspended = 1"
        + " WHERE student_email = " + connection.escape(student)
        + " AND id > 0";

        connection.query(sql, (err) => {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        });

        callback(false);

    });
});

exports.notifyStudents = ((teacher, students, callback) => {
    pool.getConnection((err, connection) => {
       if (err) {
           console.log(err);
           callback(true);
           return;
       }

       // Get all students under teacher that are not suspended
       var sql = "SELECT DISTINCT student_email FROM tadb.classes" 
       + " WHERE teacher_email = " + connection.escape(teacher)
       + " AND suspended = 0;";

       for (var student of students) {
           sql += "SELECT DISTINCT student_email FROM tadb.classes"
           + " WHERE student_email = " + connection.escape(student)
           + " AND suspended = 0;";
       }

       connection.query(sql, (err, rows) => {
           if (err) {
               console.log(err);
               callback(true);
               return;
           }
           var results = {};
           var key = "recipients";
           results[key] = [];
           for (var row of rows) {
               console.log(typeof row);
               if (Array.isArray(row)) {
                   for (var r of row) {
                       results[key].push(r.student_email);
                   }
               } else {
                    results[key].push(row.student_email);
               }
           }
           callback(false, results);
       });

    });
});

// Fails after Z
// Maybe replace with unique string generator
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}
