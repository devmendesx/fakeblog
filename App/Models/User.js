/* Get all variables and connection from Database Server */
const Sequelize = require("sequelize");
const Connection = require("../../database/user");

/* Define model Category and create table*/
const Category = Connection.define("categories", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Category.sync({force: true}) /* Sync model with database, comment line after create table*/

/* Exports module*/
module.exports = User;
