import { sequelize } from "./src/models/database";
import Employee from "./src/models/employee";
import Project from "./src/models/project";
import Role from "./src/models/roles";
import Department from "./src/models/department";
import RoleEmployee from "./src/models/role_employee";
import Room from "./src/models/room";
import Meeting from "./src/models/meeting";
import EmployeeProject from "./src/models/employee_project";
import MeetingEmployee from "./src/models/meeting_employee";

const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./src/routing/auth_router");
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

sequelize
  .authenticate()
  .then(async () => {
    // await createTable();
  })
  .catch((error) => console.log("error db connection ", error));

const createTable = async () => {
  await Department.sync({ alter: true });
  await Employee.sync({ alter: true });
  await Project.sync({ alter: true });
  await Role.sync({ alter: true });
  await RoleEmployee.sync({ force: true });
  await Room.sync({ alter: true });
  await Meeting.sync({ alter: true });
  await EmployeeProject.sync({ force: true });
  await MeetingEmployee.sync({ force: true });
};
