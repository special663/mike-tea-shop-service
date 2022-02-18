const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, "./key/private.key")
);
const PUBLICE_KEY = fs.readFileSync(
  path.resolve(__dirname, "./key/public.key")
);

module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env;

module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLICE_KEY = PUBLICE_KEY;
