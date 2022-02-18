const JWT = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");

class AuthController {
  async login(ctx, next) {
    try {
      const { name, uid, avatarUrl } = ctx.user;
      const token = JWT.sign({ name, uid }, PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: 60 * 60 * 24 * 30,
      });
      ctx.body = {
        code: 200,
        data: {
          uid,
          name,
          token,
          avatarUrl,
        },
      };
      await next();
    } catch (error) {
      console.log(error.message);
    }
  }
  async sniffing(ctx, next) {
    try {
      ctx.body = {
        code: 200,
        data: "允许访问",
      };
      await next();
    } catch (error) {}
  }
}

module.exports = new AuthController();
