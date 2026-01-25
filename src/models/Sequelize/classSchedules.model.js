import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const ClassSchedule = sequelize.define("ClassSchedule", {
  // CORRECCIÓN: Tu base de datos usa PLURAL aquí
  id_class_schedules: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_section: {
    type: DataTypes.INTEGER,
    allowNull: true // Mantenemos lo que arreglamos antes
  },
  id_subject: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  day_of_week: {
    type: DataTypes.STRING(20), 
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at'
  }
}, {
  tableName: "class_schedules",
  timestamps: true,
  underscored: true,
});

export default ClassSchedule;