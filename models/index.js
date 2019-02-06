'use strict';

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  const jawsdb = process.env.DATABASE_URL || process.env.JAWSDB_URL;
  
  if (jawsdb) { // for Heroku
    sequelize = new Sequelize(jawsdb);
  }
  else {
    require('dotenv').config();
    config.username = process.env.MYSQL_USER;
    config.password = process.env.MYSQL_PASSWD;
    
    // Create database IF it doesn't exist yet at first
    const connection = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
    });
    connection.execute('CREATE DATABASE IF NOT EXISTS ' + config.database);
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  } 
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  // Added to make sure tables get created
  db[modelName].sync(); 
  
  // Set association if defined in each model; see eatDaBurger.js
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
