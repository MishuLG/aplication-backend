import {
    getAllNewslettersModel,
    getNewsletterByIdModel,
    createNewsletterModel,
    updateNewsletterByIdModel,
    deleteNewsletterByIdModel,
    checkDuplicateNewsletterModel
} from '../models/newsletters.model.js';

export const getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await getAllNewslettersModel();
        res.json(newsletters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};

export const getNewsletterById = async (req, res) => {
    const { id } = req.params;

    try {
        const newsletter = await getNewsletterByIdModel(id);
        if (!newsletter) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.json(newsletter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
};

export const createNewsletter = async (req, res) => {
    const { uid_users, title, content, date_sent, newsletter_status, recipients } = req.body;

    const missingFields = [];
    if (!uid_users) missingFields.push('Tutor/Usuario');
    if (!title) missingFields.push('Título');
    if (!content) missingFields.push('Contenido');
    if (!date_sent) missingFields.push('Fecha de Envío');
    if (!newsletter_status) missingFields.push('Estado');
    if (!recipients) missingFields.push('Destinatarios (Texto)');

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `Faltan campos obligatorios: ${missingFields.join(', ')}` 
        });
    }

    try {
        const isDuplicate = await checkDuplicateNewsletterModel(uid_users, title, date_sent);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Ya existe un reporte idéntico para este tutor en esta fecha.' });
        }

        const newNewsletter = await createNewsletterModel(req.body);
        res.status(201).json({ message: 'Reporte creado exitosamente', newNewsletter });
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ message: 'Error al crear el reporte' });
    }
};

export const updateNewsletterById = async (req, res) => {
    const { id } = req.params;
    const { uid_users, title, content, date_sent, newsletter_status, recipients } = req.body;

    if (!uid_users || !title || !date_sent) {
        return res.status(400).json({ message: 'Usuario, Título y Fecha son obligatorios para actualizar.' });
    }

    try {
        const isDuplicate = await checkDuplicateNewsletterModel(uid_users, title, date_sent, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Conflicto: Ya existe otro reporte con estos datos.' });
        }

        const updatedNewsletter = await updateNewsletterByIdModel(id, req.body);
        if (!updatedNewsletter) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.json({ message: 'Reporte actualizado exitosamente', updatedNewsletter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el reporte' });
    }
};

export const deleteNewsletterById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNewsletter = await deleteNewsletterByIdModel(id);
        if (!deletedNewsletter) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.json({ message: 'Reporte eliminado exitosamente', deletedNewsletter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el reporte' });
    }
};