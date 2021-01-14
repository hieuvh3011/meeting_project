import { DataTypes } from "sequelize";
import { sequelize } from "./database";
import Employee from "./employee";
import Room from "./room";

const Meeting = sequelize.define(
  "meeting",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    isPeriodic: {
      type: DataTypes.BOOLEAN,
    },
    state: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    startedTime: {
      type: DataTypes.TIME,
    },
    finishedTime: {
      type: DataTypes.TIME,
    },
  },
  {
    underscored: true,
  }
);

Employee.hasOne(Meeting, { as: "creator" });

Room.hasOne(Meeting);

export default Meeting;
