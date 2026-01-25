import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Enrollment = sequelize.define("Enrollment", {
  id_enrollment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // CAMBIO: STRING + Validación
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pre-Inscrito',
    validate: {
      isIn: [['Cursando', 'Aprobado', 'Reprobado', 'Retirado', 'Pre-Inscrito']]
    }
  },
  final_average: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: "enrollments",
  timestamps: true,
  underscored: true,
});

export default Enrollment;