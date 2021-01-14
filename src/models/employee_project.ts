import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Employee from "./employee";
import Project from "./project";

const EmployeeProject = sequelize.define(
  "employee_project",
  {
    joinTime: {
      type: DataTypes.DATE,
    },
    ejectTime: {
      type: DataTypes.DATE,
    },
    roleInProject: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
  }
);

Employee.belongsToMany(Project, { through: EmployeeProject });
Project.belongsToMany(Employee, { through: EmployeeProject });

export default EmployeeProject;
