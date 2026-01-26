import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attendance_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  attendance_status: { 
    type: DataTypes.ENUM('Presente', 'Ausente', 'Justificado', 'Retardo'),
    defaultValue: 'Presente'
  },
  observations: { type: DataTypes.TEXT }
}, {
  tableName: "attendances"
});

export default Attendance;