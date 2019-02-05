/*
-------------------------------------------------------------------------------
A main app server javascript for the burger app
-------------------------------------------------------------------------------
*/
'use strict';

const path = require('path');
const PORT = process.env.PORT || 3000;

// Load express
const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();

// Load router module(s) and initialize
const Router = require('./controllers/burgers_controller');
const router = new Router(app);

// Make use of the body-parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set static directory reference path
app.use(express.static(path.join(__dirname, 'public'))); 

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Start routers
router.start();

// Start the server to listen to the port
app.listen(PORT, () => {
  console.log('Server started listening on port ' + PORT);
});
