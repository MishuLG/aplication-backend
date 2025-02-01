import { Router } from 'express';
import { getTotalUsers, getStudentRegistrationsByDay } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/total_users', getTotalUsers);
router.get('/student_registrations', getStudentRegistrationsByDay);

export default router;
