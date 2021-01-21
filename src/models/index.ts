import { sequelize } from "./database";
import Employee from "./employee";
import Project from "./project";
import Role from "./roles";
import Department from "./department";
import Room from "./room";
import Meeting from "./meeting";
import EmployeeProject from "./employee_project";
import MeetingEmployee from "./meeting_employee";

const createTable = async (): Promise<void> => {
  await Role.sync({ alter: true });
  await Room.sync({ alter: true });
  await Department.sync({ alter: true });
  await Employee.sync({ alter: true });
  await Project.sync({ alter: true });
  await Meeting.sync({ alter: true });
  await EmployeeProject.sync({ force: true });
  await MeetingEmployee.sync({ force: true });
};

export default createTable;
