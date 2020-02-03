const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tadb'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }

    console.log('Connection established');
});

connection.query('SELECT * FROM teachers', (err, rows) => {
    if (err) throw err;

    console.log('Data received from Db:');
    console.log(rows);
})

connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.

});