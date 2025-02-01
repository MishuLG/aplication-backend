import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";
import Student from "./students.model.js";
import Subject from "./subjects.model.js";
import ClassSchedule from "./classSchedules.model.js";

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
      references: {
        model: Student,
        key: "id_student",
      },
    },
    id_subject: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id_subject",
      },
    },
    id_class_schedules: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClassSchedule,
        key: "id_class_schedules",
      },
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
    updatedAt: 'updated_at', 
  }
);

Evaluation.belongsTo(Student, { foreignKey: "id_student" });
Evaluation.belongsTo(Subject, { foreignKey: "id_subject" });
Evaluation.belongsTo(ClassSchedule, { foreignKey: "id_class_schedules" });

export default Evaluation;