import { DataTypes } from "sequelize";
import { sequelize } from "./database";

const Employee = sequelize.define("employee", {
  // Model attributes are defined here
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
});

export default Employee;
