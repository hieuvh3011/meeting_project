import { DataTypes } from "sequelize";
import { sequelize } from "./database";

const Role = sequelize.define(
  "employee",
  {
    // Model attributes are defined here
    roleType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

export default Role;
