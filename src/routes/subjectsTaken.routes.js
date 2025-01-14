import { Router } from 'express';
import {
    getAllSubjectsTaken,
    getSubjectTakenById,
    createSubjectTaken,
    deleteSubjectTakenById,
    getSubjectsTakenByStudent
} from '../controllers/subjectsTaken.controller.js';

const router = Router();

router.get('/subjects_taken', getAllSubjectsTaken);
router.get('/subjects_taken/:id', getSubjectTakenById);
router.get('/subjects_taken/student/:id_student', getSubjectsTakenByStudent); 
router.post('/subjects_taken', createSubjectTaken);
router.delete('/subjects_taken/:id', deleteSubjectTakenById);

export default router;
