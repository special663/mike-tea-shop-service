const { INTERNALSERVERERROR } = require("../constants/error-types");
const {
  create,
  detail,
  list,
  update,
  remove,
  hasLabel,
  addLabel,
} = require("../service/moments.service");

class MomentsController {
  //1、发布动态
  async create(ctx, next) {
    const { uid } = ctx.user;
    const { content } = ctx.request.body;

    try {
      const result = await create(uid, content);
      ctx.body = result;

      await next();
    } catch (err) {
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //2、查看某条动态
  async detail(ctx, next) {
    try {
      const momentId = ctx.params.momentId;

      const result = await detail(momentId);
      ctx.body = result;
      await next();
    } catch (err) {
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //3、分页查询
  async list(ctx, next) {
    try {
      const { limit, offset } = ctx.query;
      const result = await list(limit, offset);

      ctx.body = result;
      await next();
    } catch (err) {
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //4、删除动态
  async remove(ctx, next) {
    const momentId = ctx.params.momentId;
    const result = await remove(momentId);
    ctx.body = result;
    await next();
  }

  //5、更新
  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    const result = await update(content, momentId);
    ctx.body = result;
    await next();
  }
  //6、添加labels
  async addLabels(ctx, next) {
    const { momentId } = ctx.params;
    const labels = ctx.labels;
    try {
      for (let item of labels) {
        if (!(await hasLabel(momentId, item.id))) {
          await addLabel(momentId, item.id);
        }
      }
      ctx.body = "创建成功！";
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new MomentsController();
