/* Get all variables and connection from Database Server */
const Sequelize = require("sequelize");
const Connection = require("../../database/server");
const Category = require("../Models/Category");
const moment = require("moment")
moment.locale("pt-br")
/* Define model Article and create table*/
const Article = Connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    //note here this is the guy that you are looking for
    get() { return moment(this.getDataValue('createdAt', "18/10/2021")).format('LLLL')},
  },
});

Category.hasMany(
  Article
); /* Giving relationship for many articles, that Category will have many articles*/
Article.belongsTo(Category); /* Articles will have always a Category*/

//Article.sync({force:true}) /* Sync model with database, comment line after created table*/

/* Exports module*/
module.exports = Article;
