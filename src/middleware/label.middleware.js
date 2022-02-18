const { isExistsLabel, create } = require("../service/label.services");

const verifyLabelExists = async (ctx, next) => {
  console.log(`label.middleware---verifyLabelExists~`);
  //获取数据
  const { labels } = ctx.request.body;
  const newLabels = [];
  //遍历查询数据库是否存在label
  for (let item of labels) {
    const isExist = await isExistsLabel(item);
    const label = { item };
    if (!isExist) {
      const result = await create(item);
      label.id = result.insertId;
    } else {
      label.id = isExist.id;
    }
    newLabels.push(label);
  }
  ctx.labels = newLabels;
  await next();
};

module.exports = {
  verifyLabelExists,
};
