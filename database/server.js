
const { Sequelize } = require("sequelize")
const connection = new Sequelize('blog','root','admin',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection