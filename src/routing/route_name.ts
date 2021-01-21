const basic_auth_route = "/auth";
const basic_employee_route = "/employee";

const auth = {
  login: `${basic_auth_route}/login`,
  register: `${basic_auth_route}/register`,
  forgotPassword: `${basic_auth_route}/forgot-password`,
};

const employee = {
  getAll: `${basic_employee_route}`,
};

module.exports = {
  auth,
  employee,
};
