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
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la lista de tutores' });
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
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el tutor' });
    }
};

export const createTutor = async (req, res) => {
    const { uid_users } = req.body;


    if (!uid_users || uid_users.trim() === '') {
        return res.status(400).json({ message: 'Error: Debe seleccionar un usuario válido para asignarlo como tutor.' });
    }

    try {
        const isDuplicate = await checkDuplicateTutorModel(uid_users);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Conflicto: Este usuario ya está registrado como tutor.' });
        }

        const newTutor = await createTutorModel({ uid_users });
        res.status(201).json({ message: 'Tutor registrado exitosamente', newTutor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al crear el tutor' });
    }
};

export const updateTutorById = async (req, res) => {
    const { id } = req.params;
    const { uid_users } = req.body;


    if (!uid_users) {
        return res.status(400).json({ message: 'Error: El campo usuario es obligatorio.' });
    }

    try {
        const isDuplicate = await checkDuplicateTutorModel(uid_users, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Conflicto: El usuario seleccionado ya pertenece a otro tutor.' });
        }

        const updatedTutor = await updateTutorByIdModel(id, { uid_users });
        if (!updatedTutor) {
            return res.status(404).json({ message: 'Tutor no encontrado para actualizar' });
        }
        res.json({ message: 'Tutor actualizado correctamente', updatedTutor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al actualizar el tutor' });
    }
};

export const deleteTutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTutor = await deleteTutorByIdModel(id);
        if (!deletedTutor) {
            return res.status(404).json({ message: 'Tutor no encontrado' });
        }
        res.json({ message: 'Tutor eliminado correctamente', deletedTutor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el tutor. Puede tener estudiantes asociados.' });
    }
};