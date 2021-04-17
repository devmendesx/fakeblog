/* Get all variables and connection from Database Server */
const Sequelize = require("sequelize");
const Connection = require("../../database/user");

/* Define model USer and create table*/
const User = Connection.define("users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  profile: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

 //User.sync({force: true}) /* Sync model with database, comment line after create table*/

/* Exports module*/
module.exports = User;
