const Router = require("koa-router");
const {
  create,
  detail,
  list,
  remove,
  update,
  addLabels,
} = require("../controller/moments.controller");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const { verifyLabelExists } = require("../middleware/label.middleware");

const MomentsRouter = new Router({ prefix: "/moments" });
//1、发布评论
MomentsRouter.post("/publish", verifyAuth, create);
//2、查询单条评论
MomentsRouter.get("/:momentId", detail);
//3、分页查询评论
MomentsRouter.get("/", list);
//4、删除评论
MomentsRouter.delete("/:momentId", verifyAuth, verifyPermission, remove);
//5、修改评论
MomentsRouter.patch("/:momentId", verifyAuth, verifyPermission, update);
//6、添加标签
MomentsRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelExists,
  addLabels
);

module.exports = MomentsRouter;
