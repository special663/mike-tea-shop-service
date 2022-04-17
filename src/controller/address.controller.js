const { INTERNALSERVERERROR } = require("../constants/error-types");
const {
  getAddressByUserId,
  getUserTelePhone,
  insertAddress,
  getAddressDetail,
  deleteAddressDetail,
  patchAddressDetail,
} = require("../service/address.service");

class AddressController {
  //1、获取地址列表信息
  async getAddress(ctx, next) {
    try {
      const { uid } = ctx.params;
      const result = await getAddressByUserId(uid);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          list: result,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //2、获取电话号码
  async selectTelePhone(ctx, next) {
    try {
      const { uid } = ctx.params;
      const [result] = await getUserTelePhone(uid);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          ...result,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //3、新增地址
  async insertAddress(ctx, next) {
    try {
      const { name, gender, telePhone, address, details, user_id, label } =
        ctx.request.body;
      const result = await insertAddress(
        name,
        gender,
        telePhone,
        address,
        details,
        user_id,
        label
      );
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          list: result,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //4、获取单个地址信息
  async getAddressDetail(ctx, next) {
    try {
      const { id } = ctx.params;
      const { uid } = ctx.query;
      const [result] = await getAddressDetail(id, uid);
      const [detail] = result;
      ctx.body = {
        code: 200,
        data: {
          code: 200,
          detail,
        },
      };
      await next();
    } catch (err) {
      console.log(err);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //5、删除单个地址信息
  async deleteAddressDetail(ctx, next) {
    try {
      const { id, uid } = ctx.request.body;
      const result = await deleteAddressDetail(id, uid);
      ctx.body = {
        code: 200,
        data: {
          code: 200,
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
  //6、修改单个地址信息
  async patchAddressDetail(ctx, next) {
    try {
      const { name, gender, telePhone, address, details, user_id, label, id } =
        ctx.request.body;
      const result = await patchAddressDetail(
        name,
        gender,
        telePhone,
        address,
        details,
        user_id,
        label,
        id
      );
      ctx.body = {
        code: 200,
        data: {
          code: 200,
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
}

module.exports = new AddressController();
