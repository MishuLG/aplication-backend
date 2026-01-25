import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Tutor = sequelize.define("Tutor", {
  id_tutor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uid_users: {
    type: DataTypes.UUID, 
    allowNull: false,
    unique: true, 
  },
  dni: {
    type: DataTypes.STRING(20),
    // CAMBIO AQUÍ: Lo ponemos en true para que acepte los registros viejos sin DNI
    allowNull: true, 
  },
  profession: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  tableName: "tutors", 
  timestamps: true,
  underscored: true,
});

export default Tutor;