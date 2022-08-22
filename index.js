const run = require('./helper/run')
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Lampmaker77?',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db`)
);


console.log(`
 _________________________________________
|                                         |
|            Employee                     |
|                 Database                |
|_________________________________________|
`);

run();

