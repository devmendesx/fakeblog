/* Get all variables and connection from Database Server */
const Sequelize = require("sequelize");
const Connection = require("../../database/server");

/* Define model Category and create table*/
const Category = Connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Category.sync({force: true}) /* Sync model with database, comment line after create table*/

/* Exports module*/
module.exports = Category;
