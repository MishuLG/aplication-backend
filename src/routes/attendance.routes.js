import { Router } from 'express';
import {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendanceById,
    deleteAttendanceById
} from '../controllers/attendance.controller.js';

const router = Router();

router.get('/attendance', getAllAttendance);
router.get('/attendance/:id', getAttendanceById);
router.post('/attendance', createAttendance);
router.put('/attendance/:id', updateAttendanceById);
router.delete('/attendance/:id', deleteAttendanceById);

export default router;
