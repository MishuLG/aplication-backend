import { Router } from 'express';
import { 
    getAllClassSchedules, 
    getClassScheduleById, 
    createClassSchedule, 
    updateClassSchedule, // Corregido (antes updateClassScheduleById)
    deleteClassSchedule  // Corregido (antes deleteClassScheduleById)
} from '../controllers/classSchedules.controller.js';

import { authenticateToken } from '../middlewares/authenticate.token.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas (o solo autenticadas)
router.get('/class_schedules', authenticateToken, getAllClassSchedules);
router.get('/class_schedules/:id', authenticateToken, getClassScheduleById);

// Rutas Protegidas (Solo Admin)
router.post('/class_schedules', authenticateToken, isAdmin, createClassSchedule);
router.put('/class_schedules/:id', authenticateToken, isAdmin, updateClassSchedule);
router.delete('/class_schedules/:id', authenticateToken, isAdmin, deleteClassSchedule);

export default router;