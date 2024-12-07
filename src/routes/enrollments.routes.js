import { Router } from 'express';
import { 
    getAllEnrollments, 
    getEnrollmentById, 
    createEnrollment, 
    deleteEnrollmentById, 
    updateEnrollmentById 
} from '../controllers/enrollments.controllers.js';

const router = Router();

router.get('/enrollments', getAllEnrollments); 
router.get('/enrollments/:id', getEnrollmentById); 
router.post('/enrollments', createEnrollment); 
router.delete('/enrollments/:id', deleteEnrollmentById); 
router.put('/enrollments/:id', updateEnrollmentById); 

export default router;