/*
-------------------------------------------------------------------------------
A controller module for the burger app, providing various routers
-------------------------------------------------------------------------------
*/

'use strict';

// const express = require('express');
const burger = require('../models/burger');

//
// Routers for the burger app
//
class Router {
  //
  // Initialize an instance with express app
  //
  // PARAMS:
  // * app = initialized express app
  //
  constructor(expressApp) {
    this.app = expressApp;
  }  
  
  //
  // Start all routers
  //
  start() {
    this.index();
    this.add();
    this.devour();
    this.remove();
  }
  
  //
  // Index Route
  //
  index() {
    this.app.get('/', (req, res) => {
      burger.list()
      .then(burgers => {
        res.render('index', {
          burgers: burgers
        });
      })
      .catch(error => console.log(error));
    });
  }
  
  //
  // Add Route
  //
  add() {
    this.app.post('/add', (req, res) => {
      const burgerName = req.body.burgerName;

      if (/^\W*$/.test(burgerName)) {
        console.log('No empty burger name allowed');
      }
      else {
        burger.add(burgerName)
          .then(result => {
            res.redirect('/');
          })
          .catch(error => console.log(error));
      }
    });
  }
  
  //
  // Devour route
  //
  devour() {
    this.app.put('/devour/:id', (req, res) => {
      // Convert "true" string to 1 (boolean)
      if ('devoured' in req.body && req.body['devoured'] === 'true') {
        req.body['devoured'] = 1;
      }
      
      burger.devour(parseInt(req.params.id), req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
          res.redirect('/');
        });
    });
  }
  
  //
  // Remove route
  //
  remove() {
    this.app.delete('/remove/:id', (req, res) => {
      burger.delete(parseInt(req.params.id))
        .then(result => {
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
          res.redirect('/');
        });
    });
  }
}

// Export the Router
module.exports = Router;
