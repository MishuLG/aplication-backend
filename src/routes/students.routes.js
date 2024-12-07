import { Router } from "express";
import { 
    getAllStudents, 
    getStudentById, 
    createStudent, 
    deleteStudentById, 
    updateStudentById 
} from '../controllers/students.controllers.js';

const router = Router();

router.get('/students', getAllStudents); 
router.get('/students/:id', getStudentById); 
router.post('/students', createStudent); 
router.delete('/students/:id', deleteStudentById); 
router.put('/students/:id', updateStudentById);

export default router;