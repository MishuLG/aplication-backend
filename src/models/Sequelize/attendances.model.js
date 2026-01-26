import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// Nota: No importamos Student ni Section aquí para evitar el error 500

const Attendance = sequelize.define("Attendance", {
  attendance_id: { // Ojo: Tu frontend y controlador usan attendance_id o id_attendance. Estandarizamos a attendance_id como PK
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_student: { // FK explicita
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_section: { // FK explicita
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attendance_date: { 
    type: DataTypes.DATEONLY, 
    defaultValue: DataTypes.NOW 
  },
  status: { // En BD se llamará 'status' o 'attendance_status'. Usamos 'status' para coincidir con tu controller
    type: DataTypes.ENUM('Presente', 'Ausente', 'Justificado', 'Retardo'),
    defaultValue: 'Presente'
  },
  observations: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: "attendances",
  timestamps: true,
  underscored: true
});

export default Attendance;