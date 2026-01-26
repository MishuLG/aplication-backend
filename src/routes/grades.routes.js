import { Router } from "express";
import { getAllGrades } from "../controllers/grades.controller.js";
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

// Ahora responde a /api/grades/
router.get("/", authenticateToken, getAllGrades); 

export default router;