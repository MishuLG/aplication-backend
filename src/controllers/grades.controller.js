import { Grade } from "../models/Sequelize/index.js";

export const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.findAll({
        order: [['id_grade', 'ASC']] // Ordenar: 1ro, 2do, 3ro...
    });
    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener grados", error: error.message });
  }
};