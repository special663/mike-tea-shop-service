const db = require("../app/database");

class LabelService {
  //创建label
  async create(name) {
    try {
      const statement = `
      INSERT INTO labels (name) VALUES (?)
    `;
      const [result] = await db.execute(statement, [name]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  //查询label
  async isExistsLabel(name) {
    try {
      const statement = `
      SELECT * FROM labels WHERE NAME=?
    `;
      const [isExists] = await db.execute(statement, [name]);
      return isExists[0];
    } catch (error) {
      console.log(error);
    }
  }
  //得到全部标签
  async getLabels(offset, limit) {
    const statement = `
     SELECT * FROM labels LIMIT ?, ?
    `;
    const [result] = await db.execute(statement, [offset, limit]);
    return result;
  }
}

module.exports = new LabelService();
