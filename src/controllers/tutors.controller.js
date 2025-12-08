import {
    getAllTutorsModel,
    getTutorByIdModel,
    createTutorModel,
    updateTutorByIdModel,
    deleteTutorByIdModel,
    checkDuplicateTutorModel
} from '../models/tutors.model.js';

export const getAllTutors = async (req, res) => {
    try {
        const tutors = await getAllTutorsModel();
        res.json(tutors);
    } catch (error) {
        console.error("Error getAllTutors:", error);
        res.status(500).json({ message: 'Error al obtener tutores' });
    }
};

export const getTutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await getTutorByIdModel(id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor no encontrado' });
        }
        res.json(tutor);
    } catch (error) {
        console.error("Error getTutorById:", error);
        res.status(500).json({ message: 'Error al obtener el tutor' });
    }
};

export const createTutor = async (req, res) => {
    const { uid_users } = req.body;

    // 1. Validación de campos
    if (!uid_users) {
        return res.status(400).json({ message: 'Debe seleccionar un usuario válido.' });
    }

    try {
        // 2. Validación de duplicados
        const isDuplicate = await checkDuplicateTutorModel(uid_users);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Este usuario ya está registrado como tutor.' });
        }

        const tutor = await createTutorModel({ uid_users });
        res.status(201).json(tutor);
    } catch (error) {
        console.error("Error createTutor:", error);
        // Error de llave foránea (usuario no existe)
        if (error.code === '23503') return res.status(400).json({ message: 'El usuario seleccionado no existe en el sistema.' });
        res.status(500).json({ message: 'Error al crear el tutor', error: error.message });
    }
};

export const updateTutorById = async (req, res) => {
    const { id } = req.params;
    const { uid_users } = req.body;

    if (!uid_users) {
        return res.status(400).json({ message: 'Debe seleccionar un usuario.' });
    }

    try {
        // 3. Validación de duplicados (excluyendo el actual)
        const isDuplicate = await checkDuplicateTutorModel(uid_users, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Este usuario ya está asignado a otro perfil de tutor.' });
        }

        const tutor = await updateTutorByIdModel(id, { uid_users });
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor no encontrado' });
        }
        res.json(tutor);
    } catch (error) {
        console.error("Error updateTutorById:", error);
        if (error.code === '23503') return res.status(400).json({ message: 'El usuario seleccionado no existe.' });
        res.status(500).json({ message: 'Error al actualizar el tutor' });
    }
};

export const deleteTutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await deleteTutorByIdModel(id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor no encontrado' });
        }
        res.json({ message: 'Tutor eliminado correctamente' });
    } catch (error) {
        console.error("Error deleteTutorById:", error);
        // Error si el tutor tiene estudiantes asignados
        if (error.code === '23503') return res.status(409).json({ message: 'No se puede eliminar: El tutor tiene estudiantes a su cargo.' });
        res.status(500).json({ message: 'Error al eliminar el tutor' });
    }
};