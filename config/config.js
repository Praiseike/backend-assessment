const { SqliteDialect } = require("@sequelize/sqlite3");

require("dotenv").config();


module.exports = {
  development: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    dialect: "sqlite",
    storage: "sqlite.db",
    logging: false,
    define: {
      underscored: true,
    },
  },
  test: {
    dialect: "sqlite",
    storage: "sqlite.db",
    logging: false,
    define: {
      underscored: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};
