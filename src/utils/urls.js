const express = require("express");

const urls = {
  "audience": process.env.AUTH_DOMAIN_URL + "api/v2/",
  "base": process.env.AUTH_DOMAIN_URL,
  "login": process.env.AUTH_DOMAIN_URL + "passwordless/start",
  "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp",
  "user_info": process.env.AUTH_DOMAIN_URL + "userinfo",
  "update_profile": process.env.AUTH_DOMAIN_URL + "api/v2/users",
  "verify_code": process.env.AUTH_DOMAIN_URL + "oauth/token",
  "credentials": {
    client_id: process.env.AUTH_CLIENT_ID,
    client_secret: process.env.AUTH_CLIENT_SECRET,
  }
  
};
module.exports = urls;
