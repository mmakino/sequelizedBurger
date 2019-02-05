/*
-------------------------------------------------------------------------------
A model for the burger app data
-------------------------------------------------------------------------------
*/

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Burger", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    devoured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};

