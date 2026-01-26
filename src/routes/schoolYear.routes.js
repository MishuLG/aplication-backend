import { Router } from "express";
import {
  getAllSchoolYears,
  getSchoolYearById,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear
} from "../controllers/schoolYear.controller.js";

const router = Router();

// Rutas para Años Escolares
// NOTA: Ya no usamos "/school_years" aquí, usamos "/" porque lo definiremos en index.js
router.get("/", getAllSchoolYears);           // GET /api/school_years
router.get("/:id", getSchoolYearById);        // GET /api/school_years/1
router.post("/", createSchoolYear);           // POST /api/school_years
router.put("/:id", updateSchoolYear);         // PUT /api/school_years/1
router.delete("/:id", deleteSchoolYear);      // DELETE /api/school_years/1

export default router;