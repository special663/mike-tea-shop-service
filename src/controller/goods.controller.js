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
  getSwipeList,
  insertShopBag,
  selectShopBagByUid,
  deleteShopBagByUid,
  updateShopBagCount,
  updateShopBagAffirm,
} = require("../service/goods.service");

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
      result.pop();
      // const { materials } = await getGoodsMaterials();
      // for (const goods of result) {
      //   if (goods.title === "益点小料") {
      //     goods.goodsList = materials;
      //     break;
      //   }
      // }
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
  //6、获取小料数据
  async material(ctx, next) {
    try {
      const { materials } = await getGoodsMaterials();
      ctx.body = {
        code: 200,
        data: materials,
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //7、提交商品到购物袋
  async insertShopBag(ctx, next) {
    try {
      const { id, uid, price, taste, count, images } = ctx.request.body;
      const result = await insertShopBag(
        id,
        uid,
        price,
        taste,
        count,
        images[0]
      );
      if (result) {
        ctx.body = {
          code: 200,
          data: {
            code: 200,
            message: "添加成功!",
          },
        };
      } else {
        throw new Error("-----goods.controller.js wrong~-------");
      }
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //8、查找购物车信息
  async selectShopBag(ctx, next) {
    try {
      const { uid } = ctx.params;
      const result = await selectShopBagByUid(uid);
      ctx.body = {
        code: 200,
        data: {
          result,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //9、清空购物车
  async clearShopBag(ctx, next) {
    try {
      const { uid } = ctx.params;
      const result = await deleteShopBagByUid(uid);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          message: "购物袋清空~",
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //10、修改购物车中该商品的数量
  async updateShopBagCount(ctx, next) {
    try {
      const { count, uid, goods_id } = ctx.request.body;
      const result = await updateShopBagCount(count, uid, goods_id);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          message: result,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //11、修改购物袋中商品是否选中
  async updateShopBagAffirm(ctx, next) {
    try {
      const { affirm, id, uid, goods_id } = ctx.request.body;
      const result = await updateShopBagAffirm(affirm, id, uid, goods_id);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          message: result,
        },
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
