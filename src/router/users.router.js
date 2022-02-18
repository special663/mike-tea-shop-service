const {
  create,
  avaterInfo,
  revampPassword,
  select,
} = require("../controller/users.controller");
const Router = require("koa-router");
const {
  verifyUser,
  handelPassword,
  verifyUserInfo,
} = require("../middleware/users.middleware");
const { picture } = require("../controller/goods.controller");

const UserRouter = new Router({ prefix: "/users" });
//1、创建用户
UserRouter.post("/select", verifyUser, select);

UserRouter.post("/", verifyUser, verifyUserInfo, handelPassword, create);
//2、获取用户头像
UserRouter.get("/:userId/avatar", avaterInfo);
UserRouter.get("/avatar/:avatarname", picture);
//3、修改密码
UserRouter.post("/:userId/revamp", verifyUser, handelPassword, revampPassword);

module.exports = UserRouter;
