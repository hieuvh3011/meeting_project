import ResponseForm from "../utils/response_form";
import * as CODE from "../utils/code";
import Employee from "../models/employee";
import { STATUS_CODES } from "http";
import Role from "../models/roles";
import RoleEmployee from "../models/role_employee";

const bcrypt = require("bcryptjs");
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
    const isCorrect = await isCorrectUser(email, password);
    if (!isCorrect) {
      resBody.status = CODE.ERROR.AUTH.INCORRECT_PASSWORD;
      resBody.message = "Email or password is incorrect";
      resBody.data = [];
    } else {
      const employee = await getEmployeeByEmail(email);
      if (employee === -1) {
        resBody.status = CODE.ERROR.AUTH.NOT_REGISTER_YET;
        resBody.message = "You are not register yet";
      } else {
        resBody.status = CODE.SUCCESS_CODE;
        resBody.message = "Login successfully!";
        resBody.data = {
          id: employee["id"],
          full_name: employee["fullName"],
          email: employee["email"],
          avatar_url: employee["avatarUrl"],
          created_at: employee["createdAt"],
          updated_at: employee["updatedAt"],
          department_id: employee["departmentId"],
        };
        console.log("employee = ", employee);
      }
    }
  }
  res.send(resBody);
};

const isCorrectUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  const hashedPassword = await getHashedPasswordByEmail(email);
  return await bcrypt.compare(password, hashedPassword);
};

const isEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isWeakPassword = (password: string): boolean => {
  return password.length < 8;
};

const onRequestRegister = async (req, res) => {
  const { email, password, full_name } = req.body;
  const resBody = new ResponseForm();
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
  } else if (!full_name) {
    resBody.status = CODE.ERROR.AUTH.MISSING_NAME;
    resBody.message = "Your name is required!";
  } else {
    const isEmailExist = await isEmployeeExist(email);
    if (isEmailExist) {
      resBody.message = "Email is already exist!";
      resBody.status = CODE.ERROR.AUTH.EMAIL_ALREADY_EXIST;
      resBody.data = [];
    } else {
      await storeEmployee(email, password, full_name);
      resBody.status = CODE.SUCCESS_CODE;
      resBody.message = "Register successfully!";
      resBody.data = await getEmployeeByEmail(email);
    }
  }
  res.send(resBody);
};

const storeEmployee = async (
  email: string,
  password: string,
  full_name: string,
  role = "standard"
): Promise<void> => {
  try {
    const roleId = await getRoleIdByType(role);
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const employee = await Employee.build({
      email,
      hashPassword: hashedPassword,
      fullName: full_name,
    });
    await employee.save();
    const employeeStored = await getEmployeeByEmail("email");
    console.log("employeeStored: ", employeeStored);
    const roleEmployee = await RoleEmployee.build({
      roleId: roleId,
      employeeId: employeeStored["id"],
    });
    await roleEmployee.save();
  } catch (exception) {
    console.log("storeEmployee exception: ", exception.toString());
  }
};

const getRoleIdByType = async (roleType: string): Promise<number> => {
  const role = await Role.findOne({ where: { role_type: roleType } });
  return role["dataValues"]["id"];
};

const getEmployeeById = async (id: number) => {
  const employee = await Employee.findOne({ where: { id: id } });
  if (employee === null) {
    return -1;
  }
  return employee["dataValues"];
};

const getEmployeeByEmail = async (email: string) => {
  const employee = await Employee.findOne({ where: { email: email } });
  if (employee === null) {
    return -1;
  }
  return employee["dataValues"];
};

const isEmployeeExist = async (email: string): Promise<boolean> => {
  const employee = await getEmployeeByEmail(email);
  return employee !== -1;
};

const getHashedPasswordByEmail = async (email: string): Promise<string> => {
  const password = await Employee.findOne({
    where: { email },
    attributes: ["hash_password"],
  });
  console.log("password = ", password["dataValues"]["hash_password"]);
  return password["dataValues"]["hash_password"];
};

module.exports = {
  onRequestLogin,
  onRequestRegister,
};
