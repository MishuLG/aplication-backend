import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const ClassSchedule = sequelize.define("ClassSchedule", {
  id_class_schedules: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: "class_schedules",
  timestamps: false, 
});

export default ClassSchedule;
