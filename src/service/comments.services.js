const db = require("../app/database");

class CommentServices {
  async createComment(momentId, content, userId) {
    try {
      const statement = `INSERT INTO comments (moment_Id, content, user_id) VALUES (?, ?, ?)`;
      const [result] = await db.execute(statement, [momentId, content, userId]);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
  //回复评论
  async replyComment(momentId, content, commentId, userId) {
    const statement = `INSERT INTO comments (moment_Id, content, comment_id, user_id) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(statement, [
      momentId,
      content,
      commentId,
      userId,
    ]);
    return result;
  }
  //修改评论
  async updateComment(commentId, content) {
    const statement = `UPDATE comments SET content = ? WHERE id = ?`;
    const [result] = await db.execute(statement, [content, commentId]);
    return result;
  }
  //删除评论
  async removeComment(commentId) {
    const statement = `DELETE FROM comments WHERE id = ?`;
    const [result] = await db.execute(statement, [commentId]);
    return result;
  }
  //获取动态下的评论
  async getList(momentId) {
    const statement = `
    SELECT 
      c.id id,c.content content, c.comment_id commentId, 
      c.user_id userId,c.createAt createTime,
      JSON_OBJECT('id', u.uid, 'name', u.name)
    FROM comments AS c
    LEFT JOIN users AS u 
    ON c.user_id=u.uid
    WHERE c.moment_id=?
    `;
    const [result] = await db.execute(statement, [momentId]);
    return result;
  }
}

module.exports = new CommentServices();
