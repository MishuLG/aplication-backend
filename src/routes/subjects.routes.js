import { Router } from 'express';
import {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubjectById,
    deleteSubjectById
} from '../controllers/subjects.controller.js';

const router = Router();

router.get('/subjects', getAllSubjects);
router.get('/subjects/:id', getSubjectById);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubjectById);
router.delete('/subjects/:id', deleteSubjectById);

export default router;
