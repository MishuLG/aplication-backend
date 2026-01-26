import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// REGLA DE ORO: No importar User ni Student aquí.

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