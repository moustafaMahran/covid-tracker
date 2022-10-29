const express = require("express");
const { body } = require("express-validator");
const logsController = require("../controllers/logs.controller");
const usersController = require("../controllers/users.controller");
const router = express.Router();
/**
 * Logs Routes
 * addLog
 * getLogs
 * getAllLogs
 */
router
  .route("/addLog")
  .post(
    body("temperature").exists(),
    body("lat").exists(),
    body("lng").exists(),
    body("createdAt").exists(),
    body("age").exists(),
    logsController.addLog
  );
router.route("/getLogs").get(logsController.getLogsByUserId);
router.route("/getAllLogs").get(logsController.getAllLogs);
/**
 * Profile Routes
 * getUserInfo
 * updateUserProfile
 */
router.route("/getUserInfo").get(usersController.getUserInfo);
router.route("/updateUserProfile").put(usersController.updateUserProfile);

module.exports = router;
