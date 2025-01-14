import { Router } from 'express';
import {
    getAllTutors,
    getTutorById,
    createTutor,
    updateTutorById,
    deleteTutorById
} from '../controllers/tutors.controller.js';

const router = Router();

router.get('/tutors', getAllTutors);
router.get('/tutors/:id', getTutorById);
router.post('/tutors', createTutor);
router.put('/tutors/:id', updateTutorById);
router.delete('/tutors/:id', deleteTutorById);

export default router;
