const { createAvatar, createGoodsPicture } = require("../service/file.service");
const { updateAvatarById } = require("../service/auth.service");
const { APP_HOST, APP_PORT } = require("../app/config");
const { INTERNALSERVERERROR } = require("../constants/error-types");

class FileController {
  //1、上传/创建头像
  async createAvatar(ctx, next) {
    try {
      const { filename, mimetype, size } = ctx.req.file;
      const { uid } = ctx.user;
      const result = await createAvatar(filename, mimetype, size, uid);

      const avatarUrl = `${APP_HOST}:${APP_PORT}/users/avatar/${filename}`;
      await updateAvatarById(avatarUrl, uid);

      ctx.body = {
        status: 200,
        message: "头像上传成功~~",
        data: result,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //2、上传/创建商品图片
  async createGoodsPicture(ctx, next) {
    let goodsId = null,
      type = "goods";

    if (ctx.query.goodsId) {
      goodsId = ctx.query.goodsId;
    } else if (ctx.query.materialId) {
      goodsId = ctx.query.materialId;
      type = "material";
    }
    try {
      const files = ctx.req.files;
      const target = [];
      for (let file of files) {
        const { filename, mimetype, size } = file;
        const result = await createGoodsPicture(
          filename,
          mimetype,
          size,
          goodsId,
          type
        );
        target.push(result);
      }

      ctx.body = {
        status: 200,
        message: "商品图片上传成功~~",
        data: target,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new FileController();
