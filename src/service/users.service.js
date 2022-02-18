const database = require("../app/database");

class UserService {
  //1、创建用户
  async create(user) {
    const { name, password, realName, telePhone, IDNumber } = user;
    //数据库操作
    const statement = `
    INSERT INTO users (name, password,realName, telePhone, IDNumber ) VALUES (?, ?, ?, ?, ?)
     `;
    const result = await database.execute(statement, [
      name,
      password,
      realName,
      telePhone,
      IDNumber,
    ]);

    return result[0];
  }
  //2、查询用户
  async getUserByName(name, type) {
    try {
      const statement = `
      SELECT * FROM users WHERE ${type}=? 
      `;
      const result = await database.execute(statement, [name]);

      return result[0];
    } catch (error) {
      console.log(error.message);
    }
  }
  //3、获取用户头像数据
  async getAvatarById(userId) {
    const statement = `
    SELECT * FROM avatars_pictures WHERE user_id = ?
    `;
    const [result] = await database.execute(statement, [userId]);

    return result[result.length - 1];
  }
  //4、更新用户密码
  async updateUserPassword(password, uid, name) {
    const statement = `
    UPDATE users SET password=? WHERE uid=? AND name=?
    `;
    const [result] = await database.execute(statement, [password, uid, name]);
    return result[0];
  }
}

module.exports = new UserService();
