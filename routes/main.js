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

  var options = {
    method: 'PATCH',
    url: 'https://dev-shjwioh1pekxrmh3.us.auth0.com/api/v2/users/email|' + userId,
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBBNVRiSktSTjZtVGRjdnc2OWlxMiJ9.eyJpc3MiOiJodHRwczovL2Rldi1zaGp3aW9oMXBla3hybWgzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJjSVBNQ0lGTGVRbVAxUkpseGx0RzNRbENWM3RraU1zWEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtc2hqd2lvaDFwZWt4cm1oMy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY2NjU4Mjk5NSwiZXhwIjoxNjY3MTg3Nzk1LCJhenAiOiJjSVBNQ0lGTGVRbVAxUkpseGx0RzNRbENWM3RraU1zWCIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmFjdGlvbnNfbG9nX3Nlc3Npb25zIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.BtbONKOqGPYOkuFjz46H_J4mn5dDyj_pUw9k5kmwxHglOVkkGWD-qUVE0FCa_k0_VjOucxP23ezTDSygZjfbbkfgcy_FIR0aA9JeGXQ_dvkINv8iVJ4jq3tbbDhCkymQpqz7Psnqsiz97lN0NlJB0FUBRcyw0cYavYGf725Lowbv8-sAdbeHl8OT2z71eCBPlItPhPDXvdm36jIEgOwQQ13AI843-41rL0uA7g3deZ_uTY7v_6wRAgbZ48fo5A9X3B8nvyFnzCq2jabniEJTD6K2TSNzDBndKEVWtry_CHfEhai6eISuP0ZWHXZdsPU1A5VBGIeSfPV2isUHy7MUZg',
      'cache-control': 'no-cache'
    },
    data: JSON.stringify({name: name})
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
};

module.exports = recordRoutes;
