const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const urls = require("./src/utils/urls");
const path = require("path");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));
// Configure Middleware for private routes
app.use(
  "/private",
  auth({
    issuerBaseURL: urls.base,
    audience: urls.audience,
  }),
  require("./src/routes/private_routes")
);
// Public routes
app.use("/public", require("./src/routes/public_routes"));
const dbo = require("./src/config/db");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
