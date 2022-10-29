const dbo = require("../config/db");

const dbInsert = async (collection, obj) => {
  let db_connect = dbo.getDb();
  let res = await db_connect.collection(`${collection}`).insertOne(obj);
  return res;
};

const dbFind = async (collection, filter) => {
  let db_connect = dbo.getDb();
  let res = await db_connect
    .collection(collection)
    .find(filter)
    .toArray();
    return res;
};

module.exports = {
  dbInsert,
  dbFind,
};
