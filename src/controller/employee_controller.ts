import { sequelize } from "./../models/database";

import ResponseForm from "../utils/response_form";
import * as CODE from "../utils/code";
import Employee from "../models/employee";
import RoleController from "./role_controller";
import JwtHelper from "../utils/jwt_helper";
import EmployeeDTO from "../dto/employee_dto";
import Role from "../models/roles";

const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");

const onRequestLogin = async (req, res): Promise<void> => {
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
      // const employee = await getEmployeeByEmail(email);
      const result = await getEmployeeDTOByEmail(email);
      await getToken(result);
      if (!result) {
        resBody.status = CODE.ERROR.AUTH.NOT_REGISTER_YET;
        resBody.message = "You are not register yet";
      } else {
        resBody.status = CODE.SUCCESS_CODE;
        resBody.message = "Login successfully!";
        resBody.data = result;
        console.log("employee = ", result);
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

const onRequestRegister = async (req, res): Promise<void> => {
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
    const roleId = await RoleController.getRoleIdByType(role);
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const employee = await Employee.build({
      email,
      hashPassword: hashedPassword,
      fullName: full_name,
      roleId,
    });
    await employee.save();
    const employeeStored = await getEmployeeByEmail("email");
    console.log("employeeStored: ", employeeStored);
  } catch (exception) {
    console.log("storeEmployee exception: ", exception.toString());
  }
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

const getEmployeeDTOByEmail = async (email: string): Promise<EmployeeDTO> => {
  const queryStatement = `select employees.id, employees.full_name, employees.department_id, employees.email, employees.hash_password, employees.created_at, employees.updated_at, roles.role_type
  from employees inner join roles on employees.role_id = roles.id where employees.email = '${email}'`;
  const rawEmployee = await sequelize.query(queryStatement, {
    type: QueryTypes.SELECT,
  });
  const employee = rawEmployee[0] || {};
  const employeeDTO = new EmployeeDTO();
  employeeDTO.id = employee["id"];
  employeeDTO.full_name = employee["full_name"];
  employeeDTO.email = employee["email"];
  employeeDTO.avatar_url = employee["avatar_url"];
  employeeDTO.created_at = employee["created_at"];
  employeeDTO.updated_at = employee["updated_at"];
  employeeDTO.role_type = employee["role_type"];
  employeeDTO.department_id = employee["department_id"];
  console.log("getEmployeeDTOByEmail = ", employeeDTO);
  return employeeDTO;
};

const getToken = async (employeeDTO: EmployeeDTO): Promise<EmployeeDTO> => {
  const accessToken = await JwtHelper.generateToken(employeeDTO);
  employeeDTO.access_token = accessToken;
  return employeeDTO;
};

const getAllEmployeeDTO = async (): Promise<Array<EmployeeDTO>> => {
  const result = [];
  const queryStatement = `select employees.id, employees.full_name, employees.department_id, employees.email, employees.hash_password, employees.created_at, employees.updated_at, roles.role_type
  from employees inner join roles on employees.role_id = roles.id`;
  const rawEmployee = await sequelize.query(queryStatement, {
    type: QueryTypes.SELECT,
  });
  rawEmployee.forEach((item, index) => {
    const employeeDTO = new EmployeeDTO();
    employeeDTO.id = item["id"];
    employeeDTO.full_name = item["full_name"];
    employeeDTO.email = item["email"];
    employeeDTO.avatar_url = item["avatar_url"];
    employeeDTO.created_at = item["created_at"];
    employeeDTO.updated_at = item["updated_at"];
    employeeDTO.role_type = item["role_type"];
    employeeDTO.department_id = item["department_id"];
    result.push(employeeDTO);
  });
  console.log("rawEmployee = ", rawEmployee);

  return result;
};

const onRequestGetAllEmployee = async (req, res): Promise<void> => {
  const resBody = new ResponseForm();
  const data = await getAllEmployeeDTO();
  resBody.status = CODE.SUCCESS_CODE;
  resBody.message = 'Get data successfully!'; 
  resBody.data = data;
  res.send(resBody);
};

export default {
  onRequestLogin,
  onRequestRegister,
  onRequestGetAllEmployee,
};
