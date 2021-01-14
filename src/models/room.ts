import { DataTypes } from "sequelize";
import { sequelize } from "./database";

const Room = sequelize.define(
  "room",
  {
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMultiAccess: {
      type: DataTypes.BOOLEAN,
    },
    openedTime: {
      type: DataTypes.TIME,
    },
    closedTime: {
      type: DataTypes.TIME,
    },
    building: {
      type: DataTypes.STRING,
    },
    capacity: {
      type: DataTypes.SMALLINT,
    },
  },
  {
    underscored: true,
  }
);

export default Room;
