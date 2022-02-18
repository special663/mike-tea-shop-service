const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_ALEADY_EXISTS,
  NO_SUCH_INFORMATION,
  PASSWORD_MISTAKE,
  USER_INFO_DEFICIENCY,
  CALL_HAS_BEEN_REGISTERED,
  IDNUMBER_HAS_BEEN_REGISTERED,
  INTERNALSERVERERROR,
} = require("../constants/error-types");
const { getUserByName } = require("../service/users.service");
const md5password = require("../utils/handel-password");

//1、验证用户登录信息
const verifyUser = async (ctx, next) => {
  console.log(`users.middleware---verifyUser~`);
  if (!ctx.params.userId) {
    const { name, password } = ctx.request.body;
    //账号密码不能为空
    if (!name || !password) {
      const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);
      return ctx.app.emit("error", error, ctx);
    }
    const result = await getUserByName(name, `name`);
    //判断没有该用户记录
    if (result.length) {
      const error = new Error(NAME_ALEADY_EXISTS);
      return ctx.app.emit("error", error, ctx);
    }
    await next();
  } else {
    const userId = ctx.params.userId;
    const result = await getUserByName(userId, `uid`);
    if (!result.length) {
      const error = new Error(NO_SUCH_INFORMATION);
      return ctx.app.emit("error", error, ctx);
    }
    const { password } = result[0];
    const { oldPassword } = ctx.request.body;
    if (md5password(oldPassword) !== password) {
      const error = new Error(PASSWORD_MISTAKE);
      return ctx.app.emit("error", error, ctx);
    }
    await next();
  }
};
//2、对密码进行加密
const handelPassword = async (ctx, next) => {
  console.log(`users.middleware---handelPassword~`);
  let password;
  if (!ctx.params.userId) {
    //获取用户传递的信息
    const { password } = ctx.request.body;
    ctx.request.body.password = md5password(password);
  } else {
    const { newPassword } = ctx.request.body;
    ctx.request.body.newPassword = md5password(newPassword);
  }
  //下一中间件
  await next();
};
//3、验证用户身份信息
const verifyUserInfo = async (ctx, next) => {
  console.log(`users.middleware---verifyUserInfo~`);
  try {
    const { realName, telePhone, IDNumber } = ctx.request.body;
    //不允许信息缺失
    if (!realName || !telePhone || !IDNumber) {
      const error = new Error(USER_INFO_DEFICIENCY);
      return ctx.app.emit("error", error, ctx);
    }
    const telePhoneExist = await getUserByName(telePhone, "telePhone");
    if (telePhoneExist.length) {
      const error = new Error(CALL_HAS_BEEN_REGISTERED);
      return ctx.app.emit("error", error, ctx);
    }
    const IDNumberExist = await getUserByName(IDNumber, "IDNumber");
    if (IDNumberExist.length) {
      const error = new Error(IDNUMBER_HAS_BEEN_REGISTERED);
      return ctx.app.emit("error", error, ctx);
    }

    await next();
  } catch (err) {
    console.log(err.message);
    const error = new Error(INTERNALSERVERERROR);
    return ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verifyUser,
  handelPassword,
  verifyUserInfo,
};
