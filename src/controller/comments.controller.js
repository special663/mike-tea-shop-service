const { INTERNALSERVERERROR } = require("../constants/error-types.js");
const {
  createComment,
  replyComment,
  updateComment,
  removeComment,
  getList,
} = require("../service/comments.services.js");

class CommentController {
  //发表评论
  async create(ctx, next) {
    try {
      const { momentId, content } = ctx.request.body;
      const { uid } = ctx.user;
      const result = await createComment(momentId, content, uid);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //回复评论
  async reply(ctx, next) {
    try {
      //获取信息
      const { momentId, content } = ctx.request.body;
      const { commentId } = ctx.params;
      const { uid } = ctx.user;
      //操作数据库
      const result = await replyComment(momentId, content, commentId, uid);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //修改评论
  async update(ctx, next) {
    try {
      const { commentId } = ctx.params;
      const { content } = ctx.request.body;
      const { uid } = ctx.user;
      const result = await updateComment(commentId, content, uid);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //删除评论
  async remove(ctx, next) {
    try {
      const { commentId } = ctx.params;
      if (!commentId) throw new Error();
      const result = await removeComment(commentId);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  //获取评论列表数据
  async list(ctx, next) {
    try {
      const { momentId } = ctx.query;
      if (!momentId) throw new Error();
      const result = await getList(momentId);
      ctx.body = result;
      await next();
    } catch (err) {
      console.log(err.message);
      const error = new Error(INTERNALSERVERERROR);
      return ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = new CommentController();
