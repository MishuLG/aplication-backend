import {
    getAllSectionsModel,
    getSectionByIdModel,
    createSectionModel,
    updateSectionByIdModel,
    deleteSectionByIdModel
} from '../models/sections.model.js';


export const getAllSections = async (req, res) => {
    try {
        const sections = await getAllSectionsModel();
        res.json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching sections' });
    }
};


export const getSectionById = async (req, res) => {
    const { id } = req.params;
    try {
        const section = await getSectionByIdModel(id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching section' });
    }
};


export const createSection = async (req, res) => {
    const { id_class_schedules, num_section } = req.body;

    
    if (!id_class_schedules || !num_section) {
        return res.status(400).json({ message: 'id_class_schedules and num_section are required' });
    }

    try {
        const section = await createSectionModel({ id_class_schedules, num_section });
        res.status(201).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating section' });
    }
};


export const updateSectionById = async (req, res) => {
    const { id } = req.params;
    const { id_class_schedules, num_section } = req.body;

    try {
        const section = await updateSectionByIdModel(id, { id_class_schedules, num_section });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating section' });
    }
};


export const deleteSectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const section = await deleteSectionByIdModel(id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json({ message: 'Section deleted successfully', section });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting section' });
    }
};
