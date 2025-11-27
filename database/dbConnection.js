const pg = require("pg-promise")();
require("dotenv").config()

const dbCon = pg(process.env.DB_URL);

module.exports= dbCon;