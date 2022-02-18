const database = require("../app/database");

const sqlFargment = `
SELECT 
  m.id, m.content, m.user_id, m.createAt, m.updateAt,
JSON_OBJECT('uid', u.uid, 'nickName', u.name) user_info
FROM moments m
JOIN users u ON u.uid=m.user_id `;

class MomentsService {
  //1、创建动态
  async create(uid, content) {
    const statement = `
    INSERT INTO moments (user_id, content) VALUES (?, ?)
    `;
    const [result] = await database.execute(statement, [uid, content]);
    return result;
  }
  //2、查看一条动态
  async detail(momentId) {
    try {
      const statement = `
        SELECT 
          m.id, m.content, m.like, m.createAt, m.updateAt,
          JSON_OBJECT('id', u.uid, 'name', u.name) author,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', c.id, 'content', c.content, 
              'commentId', c.comment_id,'createAt', c.createAt,
              'user', JSON_OBJECT('id', cu.uid, 'name', cu.name)
            )
          ) comments
        FROM moments m
        LEFT JOIN users u ON u.uid=m.user_id
        LEFT JOIN comments c ON c.moment_id=m.id
        LEFT JOIN users cu ON cu.uid=c.user_id
        WHERE m.id = ?
        `;

      const [result] = await database.execute(statement, [momentId]);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
  //3、分页查询
  async list(limit, offset) {
    const statement = `
    SELECT 
      m.id, m.content, m.user_id, m.createAt, m.updateAt,
    JSON_OBJECT('uid', u.uid, 'nickName', u.name) user_info,
    (SELECT COUNT(*) FROM comments c WHERE c.moment_id=m.id) commentsCOunt
    FROM moments m
    JOIN users u ON u.uid=m.user_id 
    LIMIT ? OFFSET ?
    `;

    const [result] = await database.execute(statement, [limit, offset]);
    return result;
  }
  //4、删除动态
  async remove(momentId) {
    const statement = `
    DELETE FROM moments WHERE id = ?
    `;
    const [result] = await database.execute(statement, [momentId]);
    return result;
  }
  //5、更新动态信息
  async update(content, momentId) {
    try {
      const statement = `
        UPDATE moments SET content = ? WHERE id = ?
        `;
      const result = await database.execute(statement, [content, momentId]);
      return result[0];
    } catch (err) {
      console.log(err.message);
    }
  }
  //6、判断是否已经存在标签
  async hasLabel(momentId, labelId) {
    const statement = `
      SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?
    `;
    const [result] = await database.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }
  //7、添加标签
  async addLabel(momentId, labelId) {
    const statement = `
        INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?)
      `;
    const [result] = await database.execute(statement, [momentId, labelId]);
    return result;
  }
}

module.exports = new MomentsService();
