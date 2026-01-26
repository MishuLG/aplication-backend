import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// ¡IMPORTANTE! NO IMPORTAR: Section, Subject aquí.

const Grade = sequelize.define("Grade", {
  id_grade: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_grade: {
    type: DataTypes.STRING, // '1er Grado'
    allowNull: false,
  },
  next_grade_id: {
    type: DataTypes.INTEGER, // Para promoción automática
    allowNull: true,
  }
}, {
  tableName: "grades",
  timestamps: false, // Según tu estructura original
  underscored: true,
});

export default Grade;