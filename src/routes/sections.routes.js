import { Router } from 'express';
import { 
    getAllSections, 
    getSectionById, 
    createSection, 
    updateSection, 
    deleteSection 
} from '../controllers/sections.controller.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas/Autenticadas
router.get('/', authenticateToken, getAllSections); // Antes '/sections'
router.get('/:id', authenticateToken, getSectionById); // Antes '/sections/:id'

// Rutas Admin
router.post('/', authenticateToken, isAdmin, createSection);
router.put('/:id', authenticateToken, isAdmin, updateSection);
router.delete('/:id', authenticateToken, isAdmin, deleteSection);

export default router;