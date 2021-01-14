import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Meeting from "./meeting";
import Employee from "./employee";

const MeetingEmployee = sequelize.define(
  "meeting_employee",
  {
    isAccepted: {
      type: DataTypes.BOOLEAN,
    },
    isCoordinate: {
      type: DataTypes.BOOLEAN,
    },
    mayJoin: {
      type: DataTypes.TINYINT,
    },
  },
  {
    underscored: true,
  }
);

Meeting.belongsToMany(Employee, { through: MeetingEmployee });
Employee.belongsToMany(Meeting, { through: MeetingEmployee });

export default MeetingEmployee;
