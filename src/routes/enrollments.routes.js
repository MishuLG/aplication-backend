import { Router } from 'express';
import { 
    getAllEnrollments, 
    getEnrollmentById, 
    createEnrollment, 
    deleteEnrollmentById, 
    updateEnrollmentById 
} from '../controllers/enrollments.controllers.js';

const router = Router();

router.get('/', getAllEnrollments); 
router.get('/:id', getEnrollmentById); 
router.post('/', createEnrollment); 
router.delete('/:id', deleteEnrollmentById); 
router.put('/:id', updateEnrollmentById); 

export default router;