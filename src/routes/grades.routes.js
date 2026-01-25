import { Router } from "express";
import { getAllGrades } from "../controllers/grades.controller.js";

const router = Router();

// Esta ruta responderá cuando llamen a /api/grades
router.get("/grades", getAllGrades);

export default router;