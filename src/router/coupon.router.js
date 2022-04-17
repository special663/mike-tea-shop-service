const Router = require("koa-router");
const { getCouponList } = require("../controller/coupon.controller");
const { verifyAuth } = require("../middleware/auth.middleware");

const CouponRouter = new Router({ prefix: "/coupon" });

//1、获取优惠券列表信息
CouponRouter.get("/list/:uid", verifyAuth, getCouponList);

module.exports = CouponRouter;
