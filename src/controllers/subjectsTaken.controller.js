import {
    getAllSubjectsTakenModel,
    getSubjectTakenByIdModel,
    createSubjectTakenModel,
    deleteSubjectTakenByIdModel,
    getSubjectsTakenByStudentModel,
} from '../models/subjectsTaken.model.js';


export const getSubjectsTakenByStudent = async (req, res) => {
    const { id_student } = req.params;

    try {
        const subjectsTaken = await getSubjectsTakenByStudentModel(id_student);

        if (subjectsTaken.length === 0) {
            return res.status(404).json({ message: 'No subjects found for this student' });
        }

        res.json(subjectsTaken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subjects for the student' });
    }
};

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
        if (!subjectTaken) {
            return res.status(404).json({ message: 'Subject taken not found' });
        }
        res.json(subjectTaken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subject taken' });
    }
};


export const createSubjectTaken = async (req, res) => {
    const { id_student, id_subject, id_school_year, final_grade } = req.body;

    
    if (!id_student || !id_subject || !id_school_year) {
        return res.status(400).json({ message: 'id_student, id_subject, and id_school_year are required' });
    }

    try {
        const subjectTaken = await createSubjectTakenModel({ id_student, id_subject, id_school_year, final_grade });
        res.status(201).json(subjectTaken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating subject taken' });
    }
};


export const deleteSubjectTakenById = async (req, res) => {
    const { id } = req.params;

    try {
        const subjectTaken = await deleteSubjectTakenByIdModel(id);
        if (!subjectTaken) {
            return res.status(404).json({ message: 'Subject taken not found' });
        }
        res.json({ message: 'Subject taken deleted successfully', subjectTaken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting subject taken' });
    }
};
