/*
-------------------------------------------------------------------------------
A USER model for the burger app data
-------------------------------------------------------------------------------
*/

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};

