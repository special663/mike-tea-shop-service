const { INTERNALSERVERERROR } = require("../constants/error-types");

class CouponController {
  //1、获取优惠券列表信息
  async getCouponList(ctx, next) {
    try {
      const { uid } = ctx.params;
      console.log(uid);
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new CouponController();
