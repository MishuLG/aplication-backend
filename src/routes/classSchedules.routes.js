import { Router } from 'express';
import { 
    createClassSchedule, 
    getClassSchedulesBySection, 
    deleteClassSchedule,
    generateAutoSchedule 
} from '../controllers/classSchedules.controller.js';

// CORRECCIÓN: Importamos 'authenticateToken' del archivo correcto
import { authenticateToken } from '../middlewares/authenticate.token.js'; 

const router = Router();

// Aplicamos el middleware de seguridad (authenticateToken) a todas las rutas
router.post('/', authenticateToken, createClassSchedule);
router.get('/section/:id_section', authenticateToken, getClassSchedulesBySection);
router.delete('/:id', authenticateToken, deleteClassSchedule);
router.post('/generate/:id_section', authenticateToken, generateAutoSchedule);

export default router;