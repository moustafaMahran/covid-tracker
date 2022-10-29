const request = require("../utils/request");
const urls = require("../utils/urls");

const login = async (userData) => {
  const data = {
    ...urls.credentials,
    connection: "email",
    email: userData.email,
    send: "code",
  };
  try {
    let res = await request(urls.login, "post", data);
    if (res.data) {
      updateUserProfile({
        userId: "email|" + res.data["_id"],
        name: userData.name,
      });
      return res.data;
    }
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const verifyCode = async (userData) => {
  const data = {
    ...urls.credentials,
    grant_type: urls.grant_type,
    username: userData.email,
    otp: userData.code,
    realm: "email",
    name: userData.name,
    audience: urls.audience,
    scope: "openid profile email",
  };
  try {
    let res = await request(urls.verify_code, "post", data);
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    return error.response;
  }
};

const getUserInfo = async (authorization) => {
  const headers = { Authorization: authorization };
  try {
    let res = await request(urls.user_info, "get", {}, headers);
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    return error.response;
  }
};

const updateUserProfile = async (userData) => {
  const data = { name: userData.name };
  const headers = {
    authorization: `Bearer ${process.env.AUTH_MNGMT_TOKEN}`,
    "cache-control": "no-cache",
  };

  try {
    let res = await request(
      urls.update_profile + "/" + userData.userId,
      "patch",
      data,
      headers
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    return error.response;
  }
};

module.exports = {
  login,
  verifyCode,
  updateUserProfile,
  getUserInfo,
  updateUserProfile,
};
