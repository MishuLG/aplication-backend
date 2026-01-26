import { Router } from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent, // Asegúrate que tu controlador exporte estos nombres
    deleteStudent
} from '../controllers/students.controllers.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

// Aplicamos seguridad (opcional, recomendado)
router.use(authenticateToken); 

router.get('/', getAllStudents);      // Antes '/students'
router.get('/:id', getStudentById);   // Antes '/students/:id'
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;