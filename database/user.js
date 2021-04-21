const { Sequelize } = require("sequelize");
const connection = new Sequelize("users", "root", "admin", {
  host: "raisbbsdb",
  dialect: "mysql",
  timezone: "-03:00",
  dialectOptions: {
    useUTC: true,
    timezone: "-03:00",
  },
});

module.exports = connection;
