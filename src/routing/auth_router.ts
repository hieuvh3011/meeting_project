const express = require("express");
const router = express.Router();
import EmployeeController from "../controller/employee_controller";

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  res.send("Ok men 2");
});

router.post("/login", async function (req, res) {
  await EmployeeController.onRequestLogin(req, res);
});

router.post("/register", async function (req, res) {
  await EmployeeController.onRequestRegister(req, res);
});

module.exports = router;
