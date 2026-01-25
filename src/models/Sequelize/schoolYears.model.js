import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const SchoolYear = sequelize.define("SchoolYear", {
  id_school_year: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_period: {
    // Aumentamos a 100 caracteres para arreglar el error de "valor demasiado largo"
    type: DataTypes.STRING(100), 
    // CAMBIO IMPORTANTE: Lo ponemos en true para que no falle si hay registros viejos vacíos
    allowNull: true, 
  },
  start_year: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_of_year: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  school_year_status: {
    type: DataTypes.STRING,
    defaultValue: 'Planificación',
    validate: { isIn: [['Planificación', 'Activo', 'Cerrado']] }
  },
  number_of_school_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0
  },
  scheduled_vacation: {
      type: DataTypes.TEXT,
      allowNull: true
  },
  special_events: {
      type: DataTypes.TEXT,
      allowNull: true
  }
}, {
  tableName: "school_years",
  timestamps: true,
  underscored: true,
});

export default SchoolYear;