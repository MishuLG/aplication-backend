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

router.get('/', getAllSubjectsTaken);
router.get('/:id', getSubjectTakenById);
router.get('/student/:id_student', getSubjectsTakenByStudent); 
router.post('/', createSubjectTaken);
router.put('/:id', updateSubjectTakenById); // Ruta habilitada
router.delete('/:id', deleteSubjectTakenById);

export default router;