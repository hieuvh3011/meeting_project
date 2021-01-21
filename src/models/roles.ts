import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Employee from "./employee";

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

Employee.belongsTo(Role);
Role.hasOne(Employee);

export default Role;
