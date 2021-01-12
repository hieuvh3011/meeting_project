const express = require("express");
const app = express();
const dotenv = require("dotenv");

const DEFAULT_PORT = 5001;
dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

app.get("/", (req, res) => {
  return res.send("ok men");
});

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
