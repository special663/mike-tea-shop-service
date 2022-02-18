const Router = require("koa-router");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const {
  create,
  reply,
  update,
  remove,
  list,
} = require("../controller/comments.controller");

const CommentRouter = new Router({ prefix: "/comments" });

CommentRouter.post("/", verifyAuth, create);
//回复,修改,删除
CommentRouter.post("/:commentId/reply", verifyAuth, reply);
CommentRouter.patch("/:commentId", verifyAuth, verifyPermission, update);
CommentRouter.delete("/:commentId", verifyAuth, verifyPermission, remove);
//获取评论列表信息
CommentRouter.get("/", list);

module.exports = CommentRouter;
