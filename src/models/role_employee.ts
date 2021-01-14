import { sequelize } from "./database";
import Role from "./roles";
import Employee from "./employee";

const RoleEmployee = sequelize.define(
  "role_employee",
  {},
  {
    underscored: true,
  }
);
Employee.belongsToMany(Role, {
  through: RoleEmployee,
  uniqueKey: "user_employee_id",
});
Role.belongsToMany(Employee, {
  through: RoleEmployee,
  uniqueKey: "user_employee_id",
});
export default RoleEmployee;
