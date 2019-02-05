/*
-------------------------------------------------------------------------------
A model for the burger app data
-------------------------------------------------------------------------------
*/

'use strict';

const orm = require('../config/orm');

class Burger {
  constructor(database = orm) {
    this.db = database;
  }
  
  //
  // Show all burgers currently in the database
  //
  list() {
    return this.db.selectAll();
  }
  
  //
  // Add a new burger into the database
  //
  add(burger) {
    return this.db.insertOne(burger);
  }
  
  //
  // Devour a burger with the "id"
  //
  devour(id, data = { devoured: true }) {
    return this.db.updateOne(id, data);
  }
  
  //
  // Delete a burger with the "id"
  //
  delete(id, data = {}) {
    return this.db.deleteOne(id, data);
  }
}

module.exports = new Burger();

