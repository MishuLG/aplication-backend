import { Router } from 'express';
import { 
    getAllSections, 
    getSectionById, 
    createSection, 
    updateSection, // Nombre corregido (antes updateSectionById)
    deleteSection  // Nombre corregido (antes deleteSectionById)
} from '../controllers/sections.controller.js';

import { authenticateToken } from '../middlewares/authenticate.token.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas (o solo autenticadas)
router.get('/sections', authenticateToken, getAllSections);
router.get('/sections/:id', authenticateToken, getSectionById);

// Rutas Protegidas (Solo Admin)
router.post('/sections', authenticateToken, isAdmin, createSection);
router.put('/sections/:id', authenticateToken, isAdmin, updateSection);
router.delete('/sections/:id', authenticateToken, isAdmin, deleteSection);

export default router;