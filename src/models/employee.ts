import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Department from "./department";
import Role from "./roles";
import RoleEmployee from "./role_employee";

const Employee = sequelize.define(
  "employee",
  {
    // Model attributes are defined here
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
  }
);

Employee.belongsTo(Department);
Department.hasOne(Employee);

Employee.hasOne(Department, {as: 'manager'})


export default Employee;
