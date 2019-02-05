/*
-------------------------------------------------------------------------------
Set up a connection to MySQL database and export the connection object
-------------------------------------------------------------------------------
*/

'use strict';

require('dotenv').config();
const mysql = require('mysql');

// Set up connection parameters
const local = {
  host: 'localhost',
  port: process.env.PORT || 3306,
  user: process.env.MYSQL_USER,        // in .env file
  password: process.env.MYSQL_PASSWD,  // in .env file
  database: 'burgers_db'
};

// const cleardb = process.env.CLEARDB_DATABASE_URL;
// const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const jawsdb = process.env.DATABASE_URL;
const connParams = (process.env.DATABASE_URL) ? jawsdb : local;
const connection = mysql.createConnection(connParams);

// Export the connection
module.exports = connection;
