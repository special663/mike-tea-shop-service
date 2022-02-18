const database = require("../app/database");

class GoodsService {
  //1、查询某条商品的详细信息
  async getGoodsDetailById(goods_id) {
    const statement = `
    SELECT 
      goods.id, goods.name, goods.oldPrice, goods.currentPrice,
      goods.detail, goods.bedCharge, goods.main,
      (
        SELECT 
          JSON_ARRAYAGG(CONCAT('http://localhost:8000/goods/images/', goods_pictures.filename))
        FROM goods_pictures 
        WHERE goods_pictures.goods_id=goods.id
      ) images,
      IF(
        COUNT(goods.id), 
        JSON_ARRAYAGG(
          JSON_OBJECT('id', materials.id, 'name', materials.name)
        ),
        NULL  
      ) material,
      (
          SELECT 
            IF(COUNT(temperature.id), JSON_ARRAYAGG(
              JSON_OBJECT('id', temperature.id,'temp', temperature.name)
            ), NULL) temp
          FROM goods_temperature
          LEFT JOIN temperature ON temperature.id=goods_temperature.temperature_id
          WHERE goods_temperature.goods_id=goods.id
      ) temp,
      (
          SELECT 
            IF(COUNT(goods_sugar.id), JSON_ARRAYAGG(
              JSON_OBJECT('id', sugar.id,'sugar', sugar.name)
            ), NULL) temp
          FROM goods_sugar
          LEFT JOIN sugar ON goods_sugar.sugar_id=sugar.id
          WHERE goods_sugar.goods_id=goods.id
            
      ) sugar
    FROM goods 
    LEFT JOIN goods_materials ON goods_materials.goods_id=goods.id
    LEFT JOIN materials ON materials.id=goods_materials.materials_id
    WHERE goods.id=?
    GROUP BY goods.id
    `;
    const [result] = await database.execute(statement, [goods_id]);

    return result[0];
  }
  //2、模糊查询商品ID
  async getGoodsIdByLike(like) {
    const statement = `
    SELECT id FROM goods WHERE name LIKE "%${like}%";
    `;
    const [result] = await database.execute(statement);
    return result;
  }
  //3、获取全部小料信息
  async getGoodsMaterials() {
    const statement = `
    SELECT 
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'id', materials.id, 'name',materials.name, 'main',materials.main,
         'deal', materials.deal,'oldPrice', materials.oldPrice, 'currentPrice', materials.currentPrice,
         'images', (SELECT 
          JSON_ARRAYAGG(CONCAT('http://localhost:8000/goods/material/', materials_pictures.filename)) 
          FROM materials_pictures WHERE materials_pictures.materials_id=materials.id)
        )
      ) materials
    FROM materials
    `;
    const [result] = await database.execute(statement);

    return result[0];
  }
  //4、获取全部商品列表数据
  async getGoodsList() {
    const statement = `
    SELECT 
      category.id, category.name title, 
      IF(COUNT(goods.id),
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'id', goods.id, 'name', goods.name, 'oldPrice', goods.oldPrice,
             'currentPrice', goods.currentPrice,
             'picture',(SELECT 
              JSON_ARRAYAGG(CONCAT('http://localhost:8000/goods/images/', goods_pictures.filename))
            FROM goods_pictures WHERE goods.id=goods_pictures.goods_id),
              'monthSell', (SELECT market.monthSell FROM market WHERE market.goods_id=goods.id)
             )),
          NULL
         ) goodsList
    FROM
    category
    LEFT JOIN goods_category ON goods_category.category_id=category.id
    LEFT JOIN goods ON goods_category.goods_id=goods.id
    GROUP BY category.id
    `;
    const [result] = await database.execute(statement);

    return result;
  }
  //5、获取轮播图数据
  async getSwipeList() {
    const statement = `
    SELECT 
      JSON_OBJECT(
        'id', goods.id,'name', goods.name,
        'image', (
  	SELECT 
  	   CONCAT('http://localhost:8000/goods/images/', goods_pictures.filename)
  	 FROM goods_pictures WHERE goods_pictures.goods_id=swipe.goods_id
        )
      ) swipeList
    FROM swipe
    LEFT JOIN goods ON swipe.goods_id=goods.id
    GROUP BY swipe.id
    `;
    const [result] = await database.execute(statement);
    return result;
  }

  async selectMarket() {
    const statement = `
    SELECT updateAt, id FROM market
    `;
    const [result] = await database.execute(statement);
    return result;
  }
  async updateMonthSell(id) {
    const statement = `
    UPDATE market SET monthSell=0 WHERE id=?
    `;
    await database.execute(statement, [id]);
  }
}

module.exports = new GoodsService();
