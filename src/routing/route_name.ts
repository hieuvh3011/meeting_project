const basic_auth_route = "/auth";

const auth = {
  login: `${basic_auth_route}/login`,
  register: `${basic_auth_route}/register`,
  forgotPassword: `${basic_auth_route}/forgot-password`,
};

module.exports = {
  auth
}
