const database = require("../app/database");

class AuthService {
  async checkResource(tableName, momentId, id) {
    //查找信息ID查找用户id
    const statement = `
    SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?
    `;
    const [result] = await database.execute(statement, [momentId, id]);
    return result.length > 0;
  }
  //2、更新用户头像信息
  async updateAvatarById(avatarUrl, id) {
    const statement = `
    UPDATE users SET avatarUrl=? where uid=?
    `;
    const result = database.execute(statement, [avatarUrl, id]);
    return result;
  }
}

module.exports = new AuthService();
