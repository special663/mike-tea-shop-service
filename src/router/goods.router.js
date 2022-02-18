const Router = require("koa-router");
const {
  detail,
  like,
  list,
  picture,
  swipe,
} = require("../controller/goods.controller");

const { verifyAuth } = require("../middleware/auth.middleware");

const GoodsRouter = new Router({ prefix: "/goods" });
//1、查询一条商品的信息
GoodsRouter.get("/:goodsId/detail", detail);
//2、模糊查询一件商品
GoodsRouter.get("/detail", like);
//3、获取全部商品列表
GoodsRouter.get("/list", list);
//4、获取商品图片
GoodsRouter.get("/images/:filename", picture);
//5、获取小料图片
GoodsRouter.get("/material/:materialname", picture);
//6、获取轮播图图片组
GoodsRouter.get("/swipe", swipe);

//5、在商品下发布评论
GoodsRouter.post("/:goodsId/comment", verifyAuth);

module.exports = GoodsRouter;
