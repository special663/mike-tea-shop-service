const Router = require("koa-router");
const { login, sniffing } = require("../controller/auth.controller");
const { verifyLogin } = require("../middleware/auth.middleware");

const authRouter = new Router();
//1、用户登录
authRouter.post("/login", verifyLogin, login);
authRouter.post("/sniffing", sniffing);

module.exports = authRouter;
