import {
    getAllTutorsModel,
    getTutorByIdModel,
    createTutorModel,
    updateTutorByIdModel,
    deleteTutorByIdModel
} from '../models/tutors.model.js';


export const getAllTutors = async (req, res) => {
    try {
        const tutors = await getAllTutorsModel();
        res.json(tutors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tutors' });
    }
};


export const getTutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await getTutorByIdModel(id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.json(tutor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tutor' });
    }
};


export const createTutor = async (req, res) => {
    const { uid_users } = req.body;

    
    if (!uid_users) {
        return res.status(400).json({ message: 'uid_users is required' });
    }

    try {
        const tutor = await createTutorModel({ uid_users });
        res.status(201).json(tutor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating tutor' });
    }
};


export const updateTutorById = async (req, res) => {
    const { id } = req.params;
    const { uid_users } = req.body;

    try {
        const tutor = await updateTutorByIdModel(id, { uid_users });
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.json(tutor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating tutor' });
    }
};


export const deleteTutorById = async (req, res) => {
    const { id } = req.params;

    try {
        const tutor = await deleteTutorByIdModel(id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.json({ message: 'Tutor deleted successfully', tutor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting tutor' });
    }
};
