import { Router } from 'express';
import {
    getAllClassSchedules,
    getClassScheduleById,
    createClassSchedule,
    updateClassScheduleById,
    deleteClassScheduleById
} from '../controllers/classSchedules.controller.js';

const router = Router();

router.get('/class_schedules', getAllClassSchedules);
router.get('/class_schedules/:id', getClassScheduleById);
router.post('/class_schedules', createClassSchedule);
router.put('/class_schedules/:id', updateClassScheduleById);
router.delete('/class_schedules/:id', deleteClassScheduleById);

export default router;