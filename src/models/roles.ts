import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Employee from "./employee";
import RoleEmployee from "./role_employee";

const Role = sequelize.define(
  "role",
  {
    // Model attributes are defined here
    roleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
  }
);

export default Role;
