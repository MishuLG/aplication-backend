import { Router } from 'express';
import {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubjectById,
    deleteSubjectById
} from '../controllers/subjects.controller.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

router.get('/', authenticateToken, getAllSubjects);
router.get('/:id', authenticateToken, getSubjectById);
router.post('/', authenticateToken, createSubject);
router.put('/:id', authenticateToken, updateSubjectById);
router.delete('/:id', authenticateToken, deleteSubjectById);

export default router;