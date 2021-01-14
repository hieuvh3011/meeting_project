import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Employee from "./employee";

const Department = sequelize.define(
  "department",
  {
    departmentName: {
      type: DataTypes.STRING,
    },
    numberOfMembers: {
      type: DataTypes.INTEGER,
    },
    managerId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
  }
);

// Department.hasOne(Employee);
// Department.hasMany(Employee);

// Department.hasOne(Employee, { foreignKey: "manager_id" });
export default Department;
