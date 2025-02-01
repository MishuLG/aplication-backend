import { Router } from 'express';
import {
    getAllSchoolYears,
    getSchoolYearById,
    createSchoolYear,
    updateSchoolYearById,
    deleteSchoolYearById
} from '../controllers/schoolYear.controller.js';

const router = Router();

router.get('/school_years', getAllSchoolYears);
router.get('/school_years/:id', getSchoolYearById);
router.post('/school_years', createSchoolYear);
router.put('/school_years/:id', updateSchoolYearById);
router.delete('/school_years/:id', deleteSchoolYearById);

export default router;
