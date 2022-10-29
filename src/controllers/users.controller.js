const userService = require("../services/users.service");
const { body, validationResult } = require("express-validator");

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    res.json(await userService.login(req.body));
  } catch (err) {
    res.json({ error: "Error occured while login" });
    next(err);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    res.json(await userService.verifyCode(req.body));
  } catch (err) {
    res.json({ error: "Not Verified" });
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    res.json(await userService.getUserInfo(req.headers.authorization));
  } catch (err) {
    res.json({ error: "Error occured while fetching user info" });
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    res.json(
      await userService.updateUserProfile({
        userId: req.auth.payload.sub,
        name: req.body.name,
      })
    );
  } catch (err) {
    res.json({ error: "Error occured while updating user profile" });
    next(err);
  }
};

module.exports = {
  login,
  verifyCode,
  getUserInfo,
  updateUserProfile,
};
