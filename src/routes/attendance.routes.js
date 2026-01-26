import { Router } from 'express';
import {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendanceById,
    deleteAttendanceById
} from '../controllers/attendance.controller.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

// Protegemos todas las rutas
router.use(authenticateToken);

// Rutas limpias (ya tienen /api/attendance en el index.js)
router.get('/', getAllAttendance);
router.get('/:id', getAttendanceById);
router.post('/', createAttendance);
router.put('/:id', updateAttendanceById);
router.delete('/:id', deleteAttendanceById);

export default router;