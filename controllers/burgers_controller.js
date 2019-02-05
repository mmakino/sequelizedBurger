/*
-------------------------------------------------------------------------------
A controller module for the burger app, providing various routers
-------------------------------------------------------------------------------
*/

'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');

//
// Index Route
//
router.get('/', (req, res) => {
  db.Burger.findAll()
    .then(burgers => {
      res.render('index', {
        burgers: burgers
      });
    })
    .catch(error => console.log(error));
});

//
// Add Route
//
router.post('/add', (req, res) => {
  const burgerName = req.body.burgerName;

  if (/^\W*$/.test(burgerName)) {
    console.log('No empty burger name allowed');
  } else {
    db.Burger.create({ name: burgerName })
      .then(result => {
        res.redirect('/');
      })
      .catch(error => console.log(error));
  }
});

//
// Devour route
//
router.put('/devour/:id', (req, res) => {
  // Convert "true" string to 1 (boolean)
  if ('devoured' in req.body && req.body['devoured'] === 'true') {
    req.body.devoured = true;
  }

  db.Burger.update({ devoured: req.body.devoured },
                   { where: { id: parseInt(req.params.id) } })
    .then(result => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
});

//
// Remove route
//
router.delete('/remove/:id', (req, res) => {
  db.Burger.destroy({ where: { id: parseInt(req.params.id) } })
    .then(result => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
});

// Export the Router
module.exports = router;