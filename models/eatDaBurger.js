/*
-------------------------------------------------------------------------------
A Eat-Da-Burger model for the burger app data
-------------------------------------------------------------------------------
*/

'use strict';

module.exports = (sequelize, DataTypes) => {
  const eat = sequelize.define("Eat", {
    burger_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  // Associations
  eat.associate = function (db) {
    eat.belongsTo(db.User, {
      foreignKey: 'user_id'
    });
    eat.belongsTo(db.Burger, {
      foreignKey: 'burger_id'
    });
  }
  
  return eat;
};