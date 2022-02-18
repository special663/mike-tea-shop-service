const fs = require("fs");
const { INTERNALSERVERERROR } = require("../constants/error-types");
const {
  GOODS_PICTURE,
  MATERIAL_PATH,
  AVATAR_PATH,
} = require("../constants/file-path");
const { findGoodsPictureByFileName } = require("../service/file.service");
const {
  getGoodsDetailById,
  getGoodsIdByLike,
  getGoodsList,
  getGoodsMaterials,
  updateMonthSell,
  selectMarket,
  getSwipeList,
} = require("../service/goods.service");
const { formatDate } = require("../utils/handel-day");

class GoodsController {
  //1、获取一条商品的详情信息
  async detail(ctx, next) {
    try {
      const { goodsId } = ctx.params;
      if (!goodsId) throw new Error();
      const result = await getGoodsDetailById(goodsId);
      ctx.body = {
        code: 200,
        data: result,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //2、模糊查询
  async like(ctx, next) {
    try {
      const { like } = ctx.query;
      if (!like) throw new Error();

      const goodsId = await getGoodsIdByLike(like);

      const target = [];
      for (let id of goodsId) {
        const result = await getGoodsDetailById(id.id);
        target.push(result);
      }
      ctx.body = {
        status: 200,
        message: "查询成功",
        data: target,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //3、获取全部商品列表
  async list(ctx, next) {
    try {
      // const marketList = await selectMarket();
      // const month = new Date().getMonth + 1;
      // for (const time of marketList) {
      //   const Date = formatDate(time.updateAt).split("-");
      //   console.log(Date, month);
      //   if (Date[1] !== month) await updateMonthSell(time.id);
      // }
      const result = await getGoodsList();
      const { materials } = await getGoodsMaterials();
      for (const goods of result) {
        if (goods.name === "益点小料") {
          goods.goodsList = materials;
          break;
        }
      }
      ctx.body = {
        code: 200,
        data: result,
      };
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //4、获取商品图片
  async picture(ctx, next) {
    try {
      let filename,
        path = GOODS_PICTURE,
        tableType = "goods";
      if (ctx.params.filename) {
        filename = ctx.params.filename;
      } else if (ctx.params.materialname) {
        filename = ctx.params.materialname;
        path = MATERIAL_PATH;
        tableType = "materials";
      } else if (ctx.params.avatarname) {
        filename = ctx.params.avatarname;
        path = AVATAR_PATH;
        tableType = "avatars";
      }
      const file = await findGoodsPictureByFileName(filename, tableType);
      const { type } = ctx.query;
      const types = ["small", "middle", "large"];
      if (types.some((item) => item === type)) {
        filename = filename + "-" + type;
      }
      ctx.response.set("content-type", file.mimetype);
      ctx.body = fs.createReadStream(`${path}/${filename}`);
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //5、获取轮播图图片
  async swipe(ctx, next) {
    try {
      const result = await getSwipeList();
      ctx.body = {
        code: 200,
        data: result,
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new GoodsController();
