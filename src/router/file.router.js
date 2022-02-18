const Router = require("koa-router");
const {
  createAvatar,
  createGoodsPicture,
} = require("../controller/file.controller");

const { verifyAuth } = require("../middleware/auth.middleware");
const {
  avatarHandler,
  goodsPictureHandler,
  pictureResize,
  materialPictureHandler,
} = require("../middleware/file.middleware");

const FileRouter = new Router({ prefix: "/upload" });

//1、用户头像上传
FileRouter.post("/avatar", verifyAuth, avatarHandler, createAvatar);
//2、上传商品图片
FileRouter.post(
  "/picture",
  goodsPictureHandler,
  pictureResize,
  createGoodsPicture
);
//3、上传配料图片
FileRouter.post(
  "/material",
  materialPictureHandler,
  pictureResize,
  createGoodsPicture
);

module.exports = FileRouter;
