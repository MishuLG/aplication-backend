import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// --- YA NO IMPORTAMOS NADA MÁS AQUÍ ---

const Evaluation = sequelize.define(
  "Evaluation",
  {
    id_evaluations: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_student: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // 'references' eliminado, se maneja en index.js
    },
    id_subject: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_class_schedules: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_rating: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    date_evaluation: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    score: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    max_score: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    evaluation_type: {
      type: DataTypes.ENUM("formative", "summative"),
      allowNull: false,
    },
  },
  {
    tableName: "evaluations",
    timestamps: true, 
    createdAt: 'created_at', 
    updated_at: 'updated_at', 
    underscored: true 
  }
);

export default Evaluation;