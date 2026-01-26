import { Tutor, User } from "../models/Sequelize/index.js";

// --- OBTENER TODOS LOS TUTORES ---
export const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.findAll({
      include: [{
        model: User,
        attributes: ['first_name', 'last_name', 'dni', 'email', 'number_tlf']
      }]
    });
    res.json(tutors);
  } catch (error) {
    console.error("Error al obtener tutores:", error);
    res.status(500).json({ message: "Error al obtener tutores" });
  }
};

// --- OBTENER UN TUTOR POR ID ---
export const getTutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const tutor = await Tutor.findByPk(id, {
      include: [{ model: User }]
    });
    if (!tutor) return res.status(404).json({ message: "Tutor no encontrado" });
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// --- CREAR TUTOR ---
export const createTutor = async (req, res) => {
  const { uid_users, profession, work_place } = req.body;
  try {
    const newTutor = await Tutor.create({
      uid_users,
      profession,
      work_place
    });
    res.status(201).json(newTutor);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tutor", error: error.message });
  }
};

// --- ACTUALIZAR TUTOR ---
export const updateTutor = async (req, res) => {
    const { id } = req.params;
    const { profession, work_place } = req.body;
    try {
        const tutor = await Tutor.findByPk(id);
        if (!tutor) return res.status(404).json({ message: "Tutor no encontrado" });

        await tutor.update({ profession, work_place });
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tutor" });
    }
};

// --- ELIMINAR TUTOR ---
export const deleteTutor = async (req, res) => {
    const { id } = req.params;
    try {
        // Nota: Si borras el tutor, el usuario (login) sigue existiendo, solo pierde el perfil de tutor.
        // Si quieres borrar todo, deberías borrar el usuario asociado en la tabla 'users'.
        const deleted = await Tutor.destroy({ where: { id_tutor: id } });
        
        if (!deleted) return res.status(404).json({ message: "Tutor no encontrado" });
        res.json({ message: "Tutor eliminado correctamente" });
    } catch (error) {
        // Error común: El tutor tiene estudiantes asignados
        res.status(409).json({ message: "No se puede eliminar: El tutor tiene estudiantes a su cargo." });
    }
};