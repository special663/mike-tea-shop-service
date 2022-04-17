const Router = require("koa-router");
const {
  getAddress,
  selectTelePhone,
  insertAddress,
  getAddressDetail,
  deleteAddressDetail,
  patchAddressDetail,
} = require("../controller/address.controller");
const { verifyAuth } = require("../middleware/auth.middleware");
const AddressRouter = new Router({ prefix: "/address" });

//1、获取地址列表信息
AddressRouter.get("/list/:uid", verifyAuth, getAddress);
//2、获取电话号码
AddressRouter.get("/telePhone/:uid", verifyAuth, selectTelePhone);
//3、新增地址
AddressRouter.post("/addition", verifyAuth, insertAddress);
//4、获取单个地址信息
AddressRouter.get("/detail/:id", verifyAuth, getAddressDetail);
//5、删除单个地址信息
AddressRouter.delete("/detail", verifyAuth, deleteAddressDetail);
//6、修改单个地址信息
AddressRouter.patch("/detail", verifyAuth, patchAddressDetail);

module.exports = AddressRouter;
