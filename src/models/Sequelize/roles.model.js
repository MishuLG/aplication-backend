import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Role = sequelize.define("Role", {
  id_rols: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    // No ponemos autoIncrement porque tú usas IDs fijos (1, 2, 3)
  },
  name_rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description_rols: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: "rols" // Forzamos el nombre exacto que usa tu sistema
});

export default Role;