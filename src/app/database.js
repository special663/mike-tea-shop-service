const mysql2 = require("mysql2");

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = require("./config");

const connection = mysql2.createPool({
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});

connection.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log(`SQL connection fail !!!`, err);
    } else {
      console.log(`SQL connection success ~~~`);
    }
  });
});
//导出异步执行结果
module.exports = connection.promise();
