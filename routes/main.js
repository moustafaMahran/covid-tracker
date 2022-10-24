const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  audience: "https://dev-shjwioh1pekxrmh3.us.auth0.com/api/v2/",
  issuerBaseURL: `https://dev-shjwioh1pekxrmh3.us.auth0.com/`,
});

const recordRoutes = express.Router();
const dbo = require("../db/conn");

const axios = require("axios");
const ManagementClient = require("auth0").ManagementClient;
const oauthManagementClient = new ManagementClient({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
});

/**
 * Registeration Routes
 * login
 * verifyCode
 */
recordRoutes.route("/login").post(function (req, response) {
  var options = {
    method: "POST",
    url: "https://dev-shjwioh1pekxrmh3.us.auth0.com/passwordless/start",
    headers: { "content-type": "application/json" },
    data: {
      client_id: "gKXast7UA0TjWK3haIqqbQnVSxNtF6L1",
      client_secret:
        "Ahw-x0ucYWjP9Hb1gIRJhhSQIErm36r1BKitMCvQrtQZLvemxmBMMmsl48nrRqMN",
      connection: "email",
      email: req.body.email,
      send: "code",
    },
  };

  axios
    .request(options)
    .then(function (res) {
      updateUserProfile(res.data["_id"], req.body.name);
      response.json(res.data);
    })
    .catch(function (error) {
      response.json({ error: error.toString() });
    });
});

recordRoutes.route("/verifyCode").post(function (req, response) {
  var options = {
    method: "POST",
    url: "https://dev-shjwioh1pekxrmh3.us.auth0.com/oauth/token",
    headers: { "content-type": "application/json" },
    data: {
      grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
      client_id: "gKXast7UA0TjWK3haIqqbQnVSxNtF6L1",
      client_secret:
        "Ahw-x0ucYWjP9Hb1gIRJhhSQIErm36r1BKitMCvQrtQZLvemxmBMMmsl48nrRqMN",
      username: req.body.email,
      otp: req.body.code,
      realm: "email",
      name: req.body.name,
      audience: "https://dev-shjwioh1pekxrmh3.us.auth0.com/api/v2/",
      scope: "openid profile email",
    },
  };

  axios
    .request(options)
    .then(function (res) {
      response.json(res.data);
    })
    .catch(function (error) {
      response.json({ error: "code not verified" });
    });
});

/**
 * Profile Routes
 * getUserInfo
 * updateUserProfile
 */

recordRoutes.route("/getUserInfo").get(checkJwt, function (req, response) {
  var options = {
    method: "GET",
    url: "https://dev-shjwioh1pekxrmh3.us.auth0.com/userinfo",
    headers: { Authorization: req.headers.authorization },
  };

  axios
    .request(options)
    .then(function (res) {
      response.json(res.data);
    })
    .catch(function (error) {
      response.json({ error: error.toString() });
    });
});

recordRoutes
  .route("/updateUserProfile")
  .put(checkJwt, function (req, response) {
    try {
      updateUserProfile(req.body.userId, req.body.name);
      response.json({ status: "ok" });
    } catch (error) {
      response.json({ status: "error", error: error.toString() });
    }
  });

/**
 * Logs Routes
 * addLog
 * getLogs
 * getAllLogs
 */

// This section will help you create a new record.
recordRoutes.route("/addLog").post(checkJwt, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    temperature: req.body.temperature,
    lat: req.body.lat,
    lng: req.body.lng,
    createdAt: req.body.createdAt,
    userId: req.body.userId,
    age: req.body.age,
  };
  db_connect.collection("logs").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

recordRoutes.route("/getLogs").get(checkJwt, function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("logs")
    .find({ userId: req.query.userId })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/getAllLogs").get(checkJwt, function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("logs")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

/**
 * Helper methods
 */

const updateUserProfile = async (userId, name) => {
  const params = { id: "email|" + userId };
  const data = { name: name };

  try {
    const res = await oauthManagementClient.updateUser(params, data);
  } catch (e) {
  }
};

module.exports = recordRoutes;
