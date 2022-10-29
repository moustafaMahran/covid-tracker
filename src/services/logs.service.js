const request = require("../utils/request");
const dbService = require("./db.service");

const addLog = async (data) => {
  let obj = {
    temperature: data.temperature,
    lat: data.lat,
    lng: data.lng,
    createdAt: data.createdAt,
    userId: data.userId,
    age: data.age,
  };
  res = await dbService.dbInsert("logs", obj);
  return res;
};

const getLogs = async (filter) => {
  res = await dbService.dbFind("logs", filter);
  return res;
};

module.exports = {
  addLog,
  getLogs,
};
