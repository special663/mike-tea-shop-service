const fs = require("fs");

const {
  create,
  getAvatarById,
  updateUserPassword,
} = require("../service/users.service");
const { AVATAR_PATH } = require("../constants/file-path");
const { INTERNALSERVERERROR } = require("../constants/error-types");

class UserController {
  //1、创建用户
  async create(ctx, next) {
    //1.获取数据
    const user = ctx.request.body;
    //2.数据库操作
    const result = await create(user);
    //3.返回数据结果
    ctx.response.body = {
      code: 200,
      data: result,
    };
    await next();
  }
  //2、用户获取头像信息
  async avaterInfo(ctx, next) {
    const { userId } = ctx.params;
    const result = await getAvatarById(userId);
    try {
      //设置文件传输格式 如果不设置浏览器就自动下载
      ctx.response.set("content-type", result.mimetype);
      ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`);
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //3、修改用户密码
  async revampPassword(ctx, next) {
    try {
      const { name, newPassword } = ctx.request.body;
      const { userId } = ctx.params;

      const result = await updateUserPassword(newPassword, userId, name);
      ctx.body = {
        status: 200,
        message: "用户密码更新成功",
        data: result,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //4、嗅探用户是否存在
  async select(ctx, next) {
    try {
      ctx.body = {
        code: 200,
        data: "允许创建用户",
      };
    } catch (error) {}
  }
}

module.exports = new UserController();
