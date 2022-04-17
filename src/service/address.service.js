const database = require("../app/database");

class AddressService {
  //1、获取用户当前全部的地址信息
  async getAddressByUserId(uid) {
    try {
      const statement = `
      SELECT * FROM address WHERE user_id=?
    `;
      const [result] = await database.execute(statement, [uid]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  //2、获取用户电话号码
  async getUserTelePhone(uid) {
    try {
      const statement = `
    SELECT telePhone FROM users WHERE uid=?
    `;
      const [result] = await database.execute(statement, [uid]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async insertAddress(
    name,
    gender,
    telePhone,
    address,
    details,
    user_id,
    label
  ) {
    try {
      const statement = `
    INSERT INTO address 
	    (name, gender, telePhone, address, details, user_id, label) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
      const result = await database.execute(statement, [
        name,
        gender,
        telePhone,
        address,
        details,
        user_id,
        label,
      ]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getAddressDetail(id, uid) {
    try {
      const statement = `
      SELECT * FROM address WHERE id=? AND user_id=?
    `;
      const result = database.execute(statement, [id, uid]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async deleteAddressDetail(id, uid) {
    try {
      const statement = `
      DELETE FROM address WHERE id=? AND user_id=?
    `;
      const result = database.execute(statement, [id, uid]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async patchAddressDetail(
    name,
    gender,
    telePhone,
    address,
    details,
    user_id,
    label,
    id
  ) {
    try {
      const statement = `
      UPDATE address SET 
        name=?, gender=?, telePhone=?, address=?, details=?, label=?
      WHERE id=? AND user_id=?
    `;
      const result = database.execute(statement, [
        name,
        gender,
        telePhone,
        address,
        details,
        label,
        id,
        user_id,
      ]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AddressService();
