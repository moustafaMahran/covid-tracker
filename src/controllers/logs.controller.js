const logsService = require("../services/logs.service");

const getLogsByUserId = async (req, res, next) => {
  try {
    res.json(await logsService.getLogs({ userId: req.query.userId }));
  } catch (err) {
    res.json({ error: "Error occured while fetching user logs" });
    next(err);
  }
};

const getAllLogs = async (req, res, next) => {
  try {
    res.json(await logsService.getLogs({}));
  } catch (err) {
    res.json({ error: "Error occured while fetching all logs" });
    next(err);
  }
};

const addLog = async (req, res, next) => {
  try {
    res.json(
      logsService.addLog({
        userId: req.auth.payload.sub,
        ...req.body,
      })
    );
  } catch (err) {
    res.json({ error: "Error adding log" });
    next(err);
  }
};

module.exports = {
  getLogsByUserId,
  getAllLogs,
  addLog,
};
