import { DataTypes } from "sequelize";
import { sequelize } from "./database";

const Project = sequelize.define("project", {
  // Model attributes are defined here
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  startedTime: {
    type: DataTypes.DATE,
  },
  finishedTime: {
    type: DataTypes.DATE
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(19,4)
  },
  actualCost: {
    type: DataTypes.DECIMAL(19,4)
  },
  numberOfMembers: {
    type: DataTypes.INTEGER
  }
}, {
  underscored: true
});

export default Project;
