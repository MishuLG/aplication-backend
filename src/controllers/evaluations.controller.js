import Evaluation from "../models/Sequelize/evaluations.model.js";
import Student from "../models/Sequelize/students.model.js";
import Subject from "../models/Sequelize/subjects.model.js";
import ClassSchedule from "../models/Sequelize/classSchedules.model.js";
import sequelize from "../database/sequelize.js";


export const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        { model: Student, attributes: ["first_name_student", "last_name_student"] },
        { model: Subject, attributes: ["name_subject"] },
        { model: ClassSchedule, attributes: ["start_time", "end_time"] } 
      ]
    });

    const formattedEvaluations = evaluations.map(evaluation => ({
      ...evaluation.get({ plain: true }),
      created_at: evaluation.created_at.toISOString().split('T')[0],
      updated_at: evaluation.updated_at.toISOString().split('T')[0]
    }));

    res.json(formattedEvaluations);
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
};


export const createEvaluation = async (req, res) => {
  try {
    const newEvaluation = await Evaluation.create(req.body);
    res.status(201).json(newEvaluation);
  } catch (error) {
    console.error("Error creating evaluation:", error);
    res.status(500).json({ message: "Error creating evaluation" });
  }
};


export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Evaluation.update(req.body, {
      where: { id_evaluations: id }
    });
    if (updated) {
      const updatedEvaluation = await Evaluation.findOne({ where: { id_evaluations: id } });
      res.status(200).json(updatedEvaluation);
    } else {
      res.status(404).json({ message: "Evaluation not found" });
    }
  } catch (error) {
    console.error("Error updating evaluation:", error);
    res.status(500).json({ message: "Error updating evaluation" });
  }
};


export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Evaluation.destroy({
      where: { id_evaluations: id }
    });
    if (deleted) {
      res.status(204).json({ message: "Evaluation deleted" });
    } else {
      res.status(404).json({ message: "Evaluation not found" });
    }
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    res.status(500).json({ message: "Error deleting evaluation" });
  }
};


export const getEvaluationsWithLeftJoin = async (req, res) => {
  try {
    const evaluations = await sequelize.query(`
      SELECT e.*, s.first_name_student, s.last_name_student, sub.name_subject
      FROM evaluations e
      LEFT JOIN students s ON e.id_student = s.id_student
      LEFT JOIN subjects sub ON e.id_subject = sub.id_subject
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations with LEFT JOIN:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
};


export const getEvaluationsWithRightJoin = async (req, res) => {
  try {
    const evaluations = await sequelize.query(`
      SELECT e.*, sub.name_subject, s.first_name_student, s.last_name_student
      FROM subjects sub
      RIGHT JOIN evaluations e ON sub.id_subject = e.id_subject
      RIGHT JOIN students s ON e.id_student = s.id_student
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations with RIGHT JOIN:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
};