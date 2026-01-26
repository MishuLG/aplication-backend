import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// REGLA DE ORO: No importar Tutor, Section ni Grade aquí.
// Las relaciones se hacen SOLO en el index.js

const Student = sequelize.define("Student", {
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_tutor: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  id_section: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_school_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
  },
  gender: {
    type: DataTypes.STRING(20),
  },
  address: {
    type: DataTypes.TEXT,
  },
  enrollment_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active',
  }
}, {
  tableName: "students",
  timestamps: true,
  underscored: true,
});

export default Student;