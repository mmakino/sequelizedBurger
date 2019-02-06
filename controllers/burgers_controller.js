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
// Retrieve all items
// * Pre-filter (removed == true) items
//
router.get('/', (req, res) => {
  db.Eat.findAll({
      where: {
        removed: {
          [db.Sequelize.Op.eq]: false
        }
      },
      include: [{
          model: db.Burger,
        },
        {
          model: db.User,
        }
      ],
      order: db.sequelize.col('Burger.name')
    })
    .then(burgers => {
      console.log('CHECK BURGERS: ' + JSON.stringify(burgers));
      res.render('index', {
        burgers: burgers
      });
    })
});

//
// Add Route
//
// Add the burger to 1)Burger[burgers] and 2)Eat[eats] tables
//
router.post('/add', (req, res) => {
  const burgerName = req.body.burgerName;

  if (/^\W*$/.test(burgerName)) {
    console.log('No empty burger name allowed');
  } else {
    db.Burger.create({
        name: burgerName
      })
      .then(result => {
        // console.log("check point: " + JSON.stringify(result));
        db.Eat.create({
            burger_id: result.id
          })
          .then(result => {
            res.redirect('/');
          })
      })
      .catch(error => console.log(error));
  }
});

//
// Devour route
//
router.put('/devour/:id', (req, res) => {
  const burgerId = parseInt(req.params.id);

  db.Burger.update({
      devoured: req.body.devoured
    }, {
      where: {
        id: burgerId
      }
    })
    .then(result => {
      eatDaBurger(db, burgerId, req.body.userName, res);
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
});

//
// 1. Add the user into User table and get the user ID
// 2. Find the burger_id in the EatDaBurger table and update the user_id
//
async function eatDaBurger(db, burgerId, userName, res) {
  const user = await db.User.findOrCreate({
      where: {
        name: userName
      }
    })
    .spread((user, created) => {
      return user;
    });

  // WHERE condition of the target data
  const whereCond = {
    where: {
      [db.Sequelize.Op.and]: {
        //user_id: user.id,
        burger_id: burgerId
      }
    }
  };

  let eaten = await db.Eat.findOne(whereCond)
  if (eaten) {
    eaten.user_id = user.id;
    await db.Eat.update({
      user_id: user.id,
      removed: false
    }, whereCond);
    res.redirect('/');
  }
}

//
// Remove route
// * Simply mark "removed" as true
//
router.delete('/remove/:id', (req, res) => {
  db.Eat.update({
      removed: true
    }, {
      where: {
        id: parseInt(req.params.id)
      }
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
});

//
// Burger consumption stat by user
//
// Comment: ORM is still very difficult for me when I need complex queries
//          
router.get('/data/by_user', (req, res) => {
db.Eat.findAll({
    attributes: {
      include: [
        [db.sequelize.fn('COUNT', db.sequelize.col('Burger.id')), 'count']
      ]
    },
    include: [{
        model: db.Burger,
        where: {
          devoured: {
            [db.Sequelize.Op.eq]: true
          }
        },
      },
      {
        model: db.User,
        where: {
          name: {
            [db.Sequelize.Op.ne]: null
          }
        }
      }
    ],
    group: ['user_id', 'burger_id'],
    order: [db.sequelize.col('User.name'), db.sequelize.col('Burger.name')]
  })
  .then(data => {
    //
    // Aggregate data by user and burger to make count for each 
    // I can think of SQL but spent(wasted) long hours w/ ORM
    //
    console.log('BY USERS: ' + JSON.stringify(data));
    let udata = {};
    data.forEach(row => {
      console.log("=> " + row.count);
      const key = JSON.stringify({
        user: row.User.name,
        burger: row.Burger.name
      });
      if (key in udata) {
        udata[key] += 1;
      } else {
        udata[key] = 1;
      }
    });
    let userData = [];
    for (const [k, v] of Object.entries(udata)) {
      let obj = JSON.parse(k);
      obj.count = v;
      userData.push(obj);
    }
    console.log('BY USERS(2): ' + JSON.stringify(userData));

    res.render('users', {
      userData: userData
    });
  });
});

// Export the Router
module.exports = router;