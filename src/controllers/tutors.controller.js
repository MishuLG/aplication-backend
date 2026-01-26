import { Tutor, User } from "../models/Sequelize/index.js";

// --- OBTENER TODOS LOS TUTORES (CON AUTO-REPARACIÓN) ---
export const getAllTutors = async (req, res) => {
  try {
    // 🧠 LÓGICA DE AUTO-SYNC:
    // Buscar usuarios que tengan rol de 'Representante' (id_rols = 2)
    // pero que AÚN NO tengan su ficha en la tabla 'Tutors'.
    const usersWithoutProfile = await User.findAll({ 
        where: { id_rols: 2 } 
    });

    // Revisamos uno por uno y les creamos la ficha si les falta
    for (const user of usersWithoutProfile) {
        const exists = await Tutor.findOne({ where: { uid_users: user.uid_users } });
        
        if (!exists) {
            await Tutor.create({
                uid_users: user.uid_users,
                profession: 'No especificada', // Datos por defecto
                work_place: 'No especificado'
            });
            console.log(`✅ Ficha de Tutor autogenerada para: ${user.first_name} ${user.last_name}`);
        }
    }

    // Ahora sí, traemos la lista oficial (Juan Pérez ya estará aquí)
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
    // Validar si ya existe
    const exists = await Tutor.findOne({ where: { uid_users } });
    if (exists) return res.status(400).json({ message: "Este usuario ya tiene perfil de tutor." });

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
        const deleted = await Tutor.destroy({ where: { id_tutor: id } });
        
        if (!deleted) return res.status(404).json({ message: "Tutor no encontrado" });
        res.json({ message: "Tutor eliminado correctamente" });
    } catch (error) {
        res.status(409).json({ message: "No se puede eliminar: El tutor tiene estudiantes a su cargo." });
    }
};