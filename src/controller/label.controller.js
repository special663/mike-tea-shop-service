const { INTERNALSERVERERROR } = require("../constants/error-types");
const { create, getLabels } = require("../service/label.services");

class LabelController {
  //发表标签
  async create(ctx, next) {
    try {
      const { name } = ctx.request.body;
      const result = await create(name);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //获取标签
  async list(ctx, next) {
    try {
      const { offset, limit } = ctx.query;
      const result = await getLabels(offset, limit);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new LabelController();
