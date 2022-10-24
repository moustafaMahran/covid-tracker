const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/main"));
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});