import { Router } from 'express';
import { 
    getAllClassSchedules, 
    createClassSchedule, 
    getClassScheduleById, 
    updateClassSchedule, 
    deleteClassSchedule,
    getClassSchedulesBySection, // <--- Importamos la función que faltaba
    generateAutoSchedule        // <--- Y el generador automático
} from '../controllers/classSchedules.controller.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

// Seguridad Global
router.use(authenticateToken);

// --- RUTAS ESPECÍFICAS (Deben ir ANTES de /:id) ---

// 1. Ver horario de una sección específica
// Esta es la que te estaba dando error 404
router.get('/section/:id_section', getClassSchedulesBySection);

// 2. Generar horario automático (Tu lógica compleja)
router.post('/generate/:id_section', generateAutoSchedule);

// --- RUTAS GENÉRICAS (CRUD Básico) ---
router.get('/', getAllClassSchedules);      // Ver todos (para listas desplegables)
router.get('/:id', getClassScheduleById);   // Ver uno por ID
router.post('/', createClassSchedule);      // Crear manual
router.put('/:id', updateClassSchedule);    // Editar
router.delete('/:id', deleteClassSchedule); // Borrar

export default router;