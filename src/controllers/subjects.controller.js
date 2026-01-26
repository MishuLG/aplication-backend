import { Subject, Grade } from "../models/Sequelize/index.js";

// --- OBTENER MATERIAS ---
export const getAllSubjects = async (req, res) => {
  try {
    const { id_grade } = req.query; 

    let options = {
        order: [['name_subject', 'ASC']], 
        attributes: ['id_subject', 'name_subject', 'description_subject'] // Agregada descripción
    };

    // Filtro opcional por grado (si se necesita a futuro)
    if (id_grade) {
        options.include = [{
            model: Grade,
            where: { id_grade: id_grade },
            attributes: [], 
            through: { attributes: [] } 
        }];
    }

    const subjects = await Subject.findAll(options);
    res.json(subjects);

  } catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ message: "Error al obtener materias", error: error.message });
  }
};

// --- OBTENER UNA MATERIA POR ID ---
export const getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findByPk(id);
        if (!subject) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// --- CREAR MATERIA ---
export const createSubject = async (req, res) => {
    const { name_subject, description_subject } = req.body;

    if (!name_subject) {
        return res.status(400).json({ message: 'El nombre de la materia es obligatorio' });
    }

    try {
        const newSubject = await Subject.create({
            name_subject,
            description_subject
        });
        res.status(201).json(newSubject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear materia', error: error.message });
    }
};

// --- ACTUALIZAR MATERIA ---
export const updateSubjectById = async (req, res) => {
    const { id } = req.params;
    const { name_subject, description_subject } = req.body;

    try {
        const subject = await Subject.findByPk(id);
        if (!subject) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        await subject.update({ name_subject, description_subject });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

// --- ELIMINAR MATERIA ---
export const deleteSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Subject.destroy({ where: { id_subject: id } });
        if (deleted) {
            res.json({ message: 'Materia eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        // Manejo amigable de errores de llave foránea (si la materia se usa en horarios)
        res.status(409).json({ message: 'No se puede eliminar: Esta materia ya está asignada a horarios o notas.' });
    }
};