import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Student = sequelize.define(
  "Student",
  {
    id_student: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name_student: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name_student: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth_student: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: false,
  }
);

export default Student;
