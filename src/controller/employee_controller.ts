import ResponseForm from "../utils/response_form";
import * as CODE from "../utils/code";
import Employee from "../models/employee";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const onRequestLogin = async (req, res) => {
  const { email, password } = req.body;
  const resBody = new ResponseForm();
  console.log("req body = ", req.body);
  if (!email) {
    resBody.status = CODE.ERROR.AUTH.MISSING_EMAIL;
    resBody.message = "Email is required!";
  } else if (email && !isEmail(email)) {
    resBody.status = CODE.ERROR.AUTH.INVALID_EMAIL;
    resBody.message = "Email is incorrect form";
  } else if (!password) {
    resBody.status = CODE.ERROR.AUTH.MISSING_PASSWORD;
    resBody.message = "Password is required!";
  } else if (password && isWeakPassword(password)) {
    resBody.status = CODE.ERROR.AUTH.WEAK_PASSWORD;
    resBody.message = "Weak password";
  } else {
    const employee = await getEmployee(email);
    if (employee === -1) {
      resBody.status = CODE.ERROR.AUTH.NOT_REGISTER_YET;
      resBody.message = "You are not register yet";
    } else {
      resBody.status = CODE.SUCCESS_CODE;
      resBody.message = "Login successfully!";
      const obj = {
        id: employee["dataValues"]["id"],
        full_name: employee["dataValues"]["fullName"],
        email: employee["dataValues"]["email"],
        avatar_url: employee["dataValues"]["avatarUrl"],
        created_at: employee["dataValues"]["createdAt"],
        updated_at: employee["dataValues"]["updatedAt"],
        department_id: employee["dataValues"]["departmentId"],
      };
      resBody.data = obj;
      console.log("employee = ", employee);
    }
  }
  res.send(resBody);
};

const isEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isWeakPassword = (password: string): boolean => {
  return password.length < 8;
};

const getEmployee = async (email: string) => {
  const employee = await Employee.findOne({ where: { email: email } });
  if (employee === null) {
    return -1;
  }
  return employee;
};

module.exports = {
  onRequestLogin,
};
