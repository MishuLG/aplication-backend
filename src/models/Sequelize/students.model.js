import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Student = sequelize.define("Student", {
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Mapeo explícito: Propiedad 'first_name' -> Columna 'first_name_student'
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name_student' // <--- ESTO ES LA CLAVE
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name_student' // <--- Mapeamos a la columna real
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date_of_birth_student' // <--- Mapeamos a la columna real
  },
  gender: {
    type: DataTypes.STRING(1), // 'M' o 'F'
    allowNull: false,
  },
  // Claves foráneas (Sequelize las maneja, pero si tienes nombres raros, defínelas)
  id_tutor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_section: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_school_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Datos opcionales
  street: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  zip_code: { type: DataTypes.STRING, allowNull: true },
  health_record: { type: DataTypes.TEXT, allowNull: true }

}, {
  tableName: "students",
  timestamps: true,
  underscored: true, // Esto ayuda con created_at y updated_at
});

export default Student;