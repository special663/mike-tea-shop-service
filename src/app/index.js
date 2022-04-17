const Koa = require("koa");
const bodypraser = require("koa-bodyparser");
const cors = require("koa-cors");

const app = new Koa();
//导入路由
const useRouter = require("../router");
//错误处理
const errorHandler = require("./error-handle");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);
app.useRouter = useRouter;
app.use(bodypraser());
app.useRouter(app);
app.on("error", errorHandler);

module.exports = app;
