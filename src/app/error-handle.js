const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_ALEADY_EXISTS,
  NAME_DOSE_NOT_EXISTS,
  PASSWORE_IS_INCORRENT,
  UNAUTHORIZED,
  UNPERMISSION,
  INTERNALSERVERERROR,
  NO_SUCH_INFORMATION,
  PASSWORD_MISTAKE,
  USER_INFO_DEFICIENCY,
  CALL_HAS_BEEN_REGISTERED,
  IDNUMBER_HAS_BEEN_REGISTERED,
} = require("../constants/error-types");

const errorHandler = function (error, ctx) {
  let status, message;
  switch (error.message) {
    case PASSWORE_IS_INCORRENT:
      status = 400; //冲突
      message = "密码错误!";
      break;
    case PASSWORD_MISTAKE:
      status = 500;
      message = "密码错误!";
      break;
    case USER_INFO_DEFICIENCY:
      status = 1000;
      message = "用户信息缺失!";
      break;
    case NAME_ALEADY_EXISTS:
      status = 1010; //冲突
      message = "该用户已经存在!";
      break;
    case NAME_DOSE_NOT_EXISTS:
      status = 1001; //冲突
      message = "该用户不存在!";
      break;
    case CALL_HAS_BEEN_REGISTERED:
      status = 1100;
      message = "电话号码已被注册!";
      break;
    case IDNUMBER_HAS_BEEN_REGISTERED:
      status = 1110;
      message = "身份证已被注册!";
      break;
    case NAME_OR_PASSWORD_IS_REQUIRED:
      status = 1111; //bad request
      message = "用户名和密码不允许为空！";
      break;
    case UNAUTHORIZED:
      status = 401;
      message = "无效token~";
      break;
    case UNPERMISSION:
      status = 401;
      message = "你无权修改!";
      break;
    case INTERNALSERVERERROR:
      status = 500;
      message = "无法处理该请求!";
      break;
    case NO_SUCH_INFORMATION:
      status = 500;
      message = "没有该资源记录!";
      break;
    default:
      status = 400;
      message = "NOT FOUND";
      break;
  }

  ctx.status = 200;
  ctx.body = {
    code: status,
    data: message,
  };
};

module.exports = errorHandler;
