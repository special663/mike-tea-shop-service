const database = require("../app/database");

class FileService {
  //1、创建/上传头像
  async createAvatar(filename, mimetype, size, uid) {
    const statement = `
    INSERT INTO avatars_pictures (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?)
    `;
    const [result] = await database.execute(statement, [
      filename,
      mimetype,
      size,
      uid,
    ]);

    return result;
  }
  //2、上传/创建商品图片
  async createGoodsPicture(filename, mimetype, size, goodsId, type) {
    let statement = `
    INSERT INTO goods_pictures (filename, mimetype, size, goods_id) 
    VALUES (?, ?, ?, ?)
    `;
    if (type === "material") {
      statement = `
      INSERT INTO materials_pictures (filename, mimetype, size, materials_id) 
      VALUES (?, ?, ?, ?)
      `;
    }
    const [result] = await database.execute(statement, [
      filename,
      mimetype,
      size,
      goodsId,
    ]);
    return result;
  }
  //3、查询商品图片记录
  async findGoodsPictureByFileName(filename, tableType) {
    const statement = `
    SELECT * FROM ${tableType}_pictures WHERE filename=?
    `;
    const [result] = await database.execute(statement, [filename]);

    return result[0];
  }
}

module.exports = new FileService();
