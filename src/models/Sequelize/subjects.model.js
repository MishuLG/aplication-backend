import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Subject = sequelize.define(
  "Subject",
  {
    id_subject: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_subject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "subjects",
    timestamps: false,
  }
);

export default Subject;
