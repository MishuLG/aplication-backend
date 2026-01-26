import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// ¡IMPORTANTE! NO IMPORTAR: Section, Subject aquí.

const ClassSchedule = sequelize.define("ClassSchedule", {
  id_class_schedules: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_section: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_subject: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.STRING(20), // 'Lunes', 'Martes'...
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  }
}, {
  tableName: "class_schedules",
  timestamps: true,
  underscored: true,
});

export default ClassSchedule;