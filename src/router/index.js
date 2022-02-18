const fs = require("fs");

const userRouter = function (app) {
  fs.readdirSync(__dirname).forEach((fileName) => {
    if (fileName === "index.js") return;
    const router = require(`./${fileName}`);
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
};

module.exports = userRouter;
