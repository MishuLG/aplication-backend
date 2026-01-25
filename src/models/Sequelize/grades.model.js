import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Grade = sequelize.define("Grade", {
  id_grade: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // La clave de la automatización: saber cuál sigue
  next_grade_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Es null para 6to grado (porque no hay 7mo en la escuela)
  }
}, {
  tableName: "grades",
  timestamps: false,
});

export default Grade;