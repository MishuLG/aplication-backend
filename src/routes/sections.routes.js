import { Router } from 'express';
import {
    getAllSections,
    getSectionById,
    createSection,
    updateSectionById,
    deleteSectionById
} from '../controllers/sections.controller.js';

const router = Router();

router.get('/sections', getAllSections);
router.get('/sections/:id', getSectionById);
router.post('/sections', createSection);
router.put('/sections/:id', updateSectionById);
router.delete('/sections/:id', deleteSectionById);

export default router;
