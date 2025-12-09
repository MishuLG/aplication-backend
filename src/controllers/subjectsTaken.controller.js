import {
    getAllSubjectsTakenModel,
    getSubjectTakenByIdModel,
    createSubjectTakenModel,
    updateSubjectTakenByIdModel, // Importamos el modelo nuevo
    deleteSubjectTakenByIdModel,
    getSubjectsTakenByStudentModel,
    checkDuplicateSubjectsTakenModel
} from '../models/subjectsTaken.model.js';

export const getAllSubjectsTaken = async (req, res) => {
    try {
        const subjectsTaken = await getAllSubjectsTakenModel();
        res.json(subjectsTaken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subjects taken' });
    }
};

export const getSubjectTakenById = async (req, res) => {
    const { id } = req.params;
    try {
        const subjectTaken = await getSubjectTakenByIdModel(id);
        if (!subjectTaken) return res.status(404).json({ message: 'Subject taken not found' });
        res.json(subjectTaken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subject taken' });
    }
};

export const getSubjectsTakenByStudent = async (req, res) => {
    const { id_student } = req.params;
    try {
        const subjectsTaken = await getSubjectsTakenByStudentModel(id_student);
        res.json(subjectsTaken); // Retornamos array vacío si no hay, en lugar de 404, para que no rompa el front
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subjects for the student' });
    }
};

export const createSubjectTaken = async (req, res) => {
    const { id_student, id_subject, id_school_year, final_grade } = req.body;

    if (!id_student || !id_subject || !id_school_year) {
        return res.status(400).json({ message: 'id_student, id_subject, and id_school_year are required' });
    }

    try {
        const isDuplicate = await checkDuplicateSubjectsTakenModel(id_student, id_subject);
        if (isDuplicate) {
            return res.status(409).json({ message: 'This student already has this subject registered.' });
        }

        const subjectTaken = await createSubjectTakenModel({ id_student, id_subject, id_school_year, final_grade });
        res.status(201).json(subjectTaken);
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(400).json({ message: 'Invalid Student, Subject or School Year ID' });
        res.status(500).json({ message: 'Error creating subject taken' });
    }
};

// --- CONTROLADOR DE ACTUALIZAR (Faltaba) ---
export const updateSubjectTakenById = async (req, res) => {
    const { id } = req.params;
    const { id_student, id_subject, id_school_year, final_grade } = req.body;

    if (!id_student || !id_subject || !id_school_year) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const isDuplicate = await checkDuplicateSubjectsTakenModel(id_student, id_subject, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'This student already has this subject registered.' });
        }

        const updatedSubject = await updateSubjectTakenByIdModel(id, { id_student, id_subject, id_school_year, final_grade });
        
        if (!updatedSubject) return res.status(404).json({ message: 'Subject taken not found' });
        
        res.json(updatedSubject);
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(400).json({ message: 'Invalid Student, Subject or School Year ID' });
        res.status(500).json({ message: 'Error updating subject taken' });
    }
};

export const deleteSubjectTakenById = async (req, res) => {
    const { id } = req.params;
    try {
        const subjectTaken = await deleteSubjectTakenByIdModel(id);
        if (!subjectTaken) return res.status(404).json({ message: 'Subject taken not found' });
        res.json({ message: 'Subject taken deleted successfully', subjectTaken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting subject taken' });
    }
};