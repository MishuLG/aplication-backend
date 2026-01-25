import { Router } from "express";
import {
  getAllSchoolYears,
  getSchoolYearById,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear // <--- Aquí estaba el error, ahora coincide con el controlador
} from "../controllers/schoolYear.controller.js";

const router = Router();

// Rutas para Años Escolares
router.get("/school_years", getAllSchoolYears);       // Obtener todos
router.get("/school_years/:id", getSchoolYearById);   // Obtener uno
router.post("/school_years", createSchoolYear);       // Crear
router.put("/school_years/:id", updateSchoolYear);    // Actualizar
router.delete("/school_years/:id", deleteSchoolYear); // Eliminar (Nombre corregido)

export default router;