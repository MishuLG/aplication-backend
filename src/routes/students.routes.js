import { Router } from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudentById,
    deleteStudentById
} from '../controllers/students.controllers.js';

const router = Router();

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudentById);
router.delete('/students/:id', deleteStudentById);

export default router;