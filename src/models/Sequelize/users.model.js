import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const User = sequelize.define("User", {
  uid_users: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    primaryKey: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, unique: true },
  number_tlf: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.STRING(20) },
  status: { type: DataTypes.STRING(20), defaultValue: 'active' },
  profile_pic: { type: DataTypes.TEXT } // Aquí se guardará tu imagen Base64
}, {
  tableName: "users"
});

export default User;