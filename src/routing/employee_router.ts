const express = require("express");
const router = express.Router();
import EmployeeController from "../controller/employee_controller";
import AuthMiddleware from "../middleware/auth_middleware";
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", AuthMiddleware.isAuth, async function (req, res) {
  await EmployeeController.onRequestGetAllEmployee(req, res);
});

// router.post("/register", async function (req, res) {
//   await EmployeeController.onRequestRegister(req, res);
// });

module.exports = router;
