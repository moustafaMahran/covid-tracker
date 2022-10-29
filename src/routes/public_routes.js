const express = require("express");
const { body } = require("express-validator");
const usersController = require("../controllers/users.controller");
const router = express.Router();

/**
 * User Routes:
 * login
 * verifyCode
 */
router.route("/login").post(body("email").isEmail(), usersController.login);
router
  .route("/verifyCode")
  .post(
    body("email").isEmail(),
    body("code").exists(),
    body("name").exists(),
    usersController.verifyCode
  );

module.exports = router;
