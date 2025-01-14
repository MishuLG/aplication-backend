import {
    getAllSubjectsModel,
    getSubjectByIdModel,
    createSubjectModel,
    updateSubjectByIdModel,
    deleteSubjectByIdModel
} from '../models/subjects.model.js';


export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await getAllSubjectsModel();
        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
};


export const getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await getSubjectByIdModel(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subject' });
    }
};


export const createSubject = async (req, res) => {
    const { id_class_schedules, id_school_year, name_subject, description_subject } = req.body;

    
    if (!id_class_schedules || !id_school_year || !name_subject || !description_subject) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const subject = await createSubjectModel({ id_class_schedules, id_school_year, name_subject, description_subject });
        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating subject' });
    }
};


export const updateSubjectById = async (req, res) => {
    const { id } = req.params;
    const { id_class_schedules, id_school_year, name_subject, description_subject } = req.body;

    try {
        const subject = await updateSubjectByIdModel(id, { id_class_schedules, id_school_year, name_subject, description_subject });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating subject' });
    }
};


export const deleteSubjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await deleteSubjectByIdModel(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json({ message: 'Subject deleted successfully', subject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting subject' });
    }
};
