import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Department from "./department";

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
    hashPassword: {
      type: DataTypes.STRING
    }
  },
  {
    underscored: true,
  }
);

Employee.belongsTo(Department);
Department.hasOne(Employee);



export default Employee;
