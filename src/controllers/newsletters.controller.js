import {
    getAllNewslettersModel,
    getNewsletterByIdModel,
    createNewsletterModel,
    updateNewsletterByIdModel,
    deleteNewsletterByIdModel
} from '../models/newsletters.model.js';

export const getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await getAllNewslettersModel();
        res.json(newsletters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving newsletters' });
    }
};

export const getNewsletterById = async (req, res) => {
    const { id } = req.params;

    try {
        const newsletter = await getNewsletterByIdModel(id);
        if (!newsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json(newsletter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving newsletter' });
    }
};

export const createNewsletter = async (req, res) => {
    const { uid_users, title, content, date_sent, newsletter_status, recipients } = req.body;

    if (!uid_users || !title || !content || !date_sent || !newsletter_status || !recipients) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newNewsletter = await createNewsletterModel({ uid_users, title, content, date_sent, newsletter_status, recipients });
        res.status(201).json({ message: 'Newsletter created successfully', newNewsletter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating newsletter' });
    }
};

export const updateNewsletterById = async (req, res) => {
    const { id } = req.params;
    const { title, content, date_sent, newsletter_status, recipients } = req.body;

    try {
        const updatedNewsletter = await updateNewsletterByIdModel(id, { title, content, date_sent, newsletter_status, recipients });
        if (!updatedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json({ message: 'Newsletter updated successfully', updatedNewsletter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating newsletter' });
    }
};

export const deleteNewsletterById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNewsletter = await deleteNewsletterByIdModel(id);
        if (!deletedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json({ message: 'Newsletter deleted successfully', deletedNewsletter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting newsletter' });
    }
};
