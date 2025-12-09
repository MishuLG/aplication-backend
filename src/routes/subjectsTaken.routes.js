import { Router } from 'express';
import {
    getAllSubjectsTaken,
    getSubjectTakenById,
    createSubjectTaken,
    updateSubjectTakenById, // Ahora sí existe en el controlador
    deleteSubjectTakenById,
    getSubjectsTakenByStudent
} from '../controllers/subjectsTaken.controller.js';

const router = Router();

router.get('/subjects_taken', getAllSubjectsTaken);
router.get('/subjects_taken/:id', getSubjectTakenById);
router.get('/subjects_taken/student/:id_student', getSubjectsTakenByStudent); 
router.post('/subjects_taken', createSubjectTaken);
router.put('/subjects_taken/:id', updateSubjectTakenById); // Ruta habilitada
router.delete('/subjects_taken/:id', deleteSubjectTakenById);

export default router;