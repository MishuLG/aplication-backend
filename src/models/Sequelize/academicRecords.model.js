import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const AcademicRecord = sequelize.define("AcademicRecord", {
  id_record: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  final_grade: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  attendance_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  // CAMBIO: STRING + Validación
  status_subject: {
    type: DataTypes.STRING,
    defaultValue: 'Sin Nota',
    validate: {
      isIn: [['Aprobado', 'Reprobado', 'Sin Nota']]
    }
  }
}, {
  tableName: "academic_records",
  timestamps: true,
  underscored: true,
});

export default AcademicRecord;