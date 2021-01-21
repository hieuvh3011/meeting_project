import { sequelize } from "./src/models/database";
import createTable from "./src/models";

const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./src/routing/auth_router");
const employeeRoute = require("./src/routing/employee_router");
const routeName = require("./src/routing/route_name");

const bodyParser = require("body-parser");

/**
 * end import here
 * Use mixed import in this file
 * */

const app = express();
const DEFAULT_PORT = 5001;
dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

// app.get("/", (req, res) => {
//   return res.send("ok men");
// });

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
app.use("/auth", authRoute);
app.use("/employee", employeeRoute);

sequelize
  .authenticate()
  .then(async () => {
    // await createTable();
  })
  .catch((error) => console.log("error db connection ", error));
