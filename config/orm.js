/*
-------------------------------------------------------------------------------
ORM module for database operations
-------------------------------------------------------------------------------
*/

'use strict';

// Import database connection 
const dbConn = require('./connection');

//
// Object Relational Mapper class for the "burgers" table
//
class ORM {
  //
  // Initialize an instance
  // 
  constructor(connection = dbConn, table = 'burgers') {
    this.conn = connection;  // Database connection object
    this.table = table;      // Table name
  }
  
  //
  // Select all rows
  //
  // CAUTION: heroku doesn't seem to like "*" for unknown reason
  //
  selectAll(table = this.table, columns = '*') {
    // const query = 'SELECT ?? FROM ??';
    const query = 'SELECT id, burger_name, devoured FROM burgers';
    
    return new Promise((resolve, reject) => {
      // this.conn.query(query, [columns, table], (error, result) => {
      this.conn.query(query, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
  
  //
  // Insert one row into the burgers table
  //
  insertOne(burgerName, devoured = false) {
    const data = {
      burger_name: burgerName,
      devoured: devoured 
    }
    // const query = `INSERT INTO ${this.table}(burger_name, devoured) VALUES($1, $2)`;
    const query = 'INSERT INTO ?? SET ?';
    
    return new Promise((resolve, reject) => {
      // this.conn.query(query, [data.burger_name, data.devoured], (error, result) => {
      this.conn.query(query, [this.table, data], (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
  
  //
  // Update a row
  //
  // PARAMS:
  // * id = row ID in the table
  // * obj = { burger_name: <name>, devoured: <true/false> }
  //
  updateOne(id, obj) {
    // const query = `UPDATE ${this.table} SET devoured = $1 WHERE id = $2`;
    const query = 'UPDATE ?? SET ? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      // this.conn.query(query, [obj.devoured, id], (error, result, fields) => {
      this.conn.query(query, [this.table, obj, id], (error, result, fields) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
  
  //
  // Delete a row
  // 
  // PARAMS:
  // * id = row ID
  // * obj = <ignored>
  //
  deleteOne(id, obj) {
    // const query = `DELETE FROM ${this.table} WHERE id = $1`;
    const query = 'DELETE FROM ?? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      // this.conn.query(query, [id], (error, result, fields) => {
      this.conn.query(query, [this.table, id], (error, result, fields) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
}

module.exports = new ORM(dbConn);
