require("dotenv").config();
const auth = require("./routes/auth");
const users = require("./routes/users");
const headlines = require("./routes/headlines");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
require("./middleware/prod")(app);

const headKey = process.env.headlines_jwtPrivateKey;

if (!headKey) {
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const DB = "mongodb://localhost/headlines";
mongoose
  .connect(DB)
  .then(console.log("Connecting to mongodb..."))
  .catch((err) => console.error(err));

app.use("/api/headlines", headlines);

app.use("/api/users", users);

app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
