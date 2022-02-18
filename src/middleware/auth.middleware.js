const JWT = require("jsonwebtoken");
const { PUBLICE_KEY } = require("../app/config");
const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_DOSE_NOT_EXISTS,
  PASSWORE_IS_INCORRENT,
  UNAUTHORIZED,
  UNPERMISSION,
} = require("../constants/error-types");
const { checkResource } = require("../service/auth.service");
const { getUserByName } = require("../service/users.service");
const md5password = require("../utils/handel-password");

const verifyLogin = async (ctx, next) => {
  try {
    console.log(`auth.middleware---verifyLogin~`);
    //1、判断用户账号密码
    const { name, password } = ctx.request.body;
    console.log(name, password);
    if (!name || !password) {
      const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);
      return ctx.app.emit("error", error, ctx);
    }
    //2、判断用户是否存在
    const result = await getUserByName(name, `name`);
    if (!result.length) {
      const error = new Error(NAME_DOSE_NOT_EXISTS);
      return ctx.app.emit("error", error, ctx);
    }
    //3、判断用户密码是否匹配
    const userInfo = result[0];
    if (md5password(password) !== userInfo.password) {
      const error = new Error(PASSWORE_IS_INCORRENT);
      return ctx.app.emit("error", error, ctx);
    }
    ctx.user = userInfo;
    await next();
  } catch (err) {
    console.log(err.message);
    const error = new Error(UNAUTHORIZED);
    console.log("————————登录失败————————");
    return ctx.app.emit("error", error, ctx);
  }
};

const verifyAuth = async (ctx, next) => {
  console.log(`auth.middleware---verifyAuth~`);
  const authorization = ctx.header.authorization;
  if (!authorization) {
    const error = new Error(UNAUTHORIZED);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const user = JWT.verify(token, PUBLICE_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = user;
    ctx.body = "token有效~";
    console.log("————————验证登录成功————————");
    await next();
  } catch (err) {
    console.log(err.message);
    const error = new Error(UNAUTHORIZED);
    console.log("————————验证登录失败————————");
    return ctx.app.emit("error", error, ctx);
  }
};

//权限查阅
const verifyPermission = async (ctx, next) => {
  console.log(`auth.middleware---verifyPermission~`);
  //获取数据
  const [resourceKey] = Object.keys(ctx.params);
  tableName = resourceKey.replace("Id", "s");
  const momentId = ctx.params[resourceKey];
  const { uid } = ctx.user;
  //操作数据库
  try {
    const result = await checkResource(tableName, momentId, uid);
    if (!result) throw new Error();
    console.log("————————验证权限成功————————");
    await next();
  } catch (err) {
    const error = new Error(UNPERMISSION);
    console.log("————————验证权限失败————————");
    return ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission,
};
