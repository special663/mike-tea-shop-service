const app = require("./app/index");
const { APP_PORT } = require("./app/config");
require("./app/database");

app.listen(APP_PORT, () =>
  console.log(`service running on ${APP_PORT} port~~`)
);
