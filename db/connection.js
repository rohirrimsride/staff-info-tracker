const mysql = require('mysql2');
require('dotenv').config();
/*Create a .env file in the root directory with;
DB_USER = 'your mysql username'
DB_PASSWORD = 'yourmysqlpassword' 
and the .env file to .gitignore*/
const db = mysql.createConnection(
    {
        host: 'localhost',

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD,

        database: 'staff_db'
    },
);

module.exports = db;