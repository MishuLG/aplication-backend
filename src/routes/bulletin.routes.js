import { Router } from "express";
import { generateBulletinPDF } from "../controllers/bulletin.controller.js";

const router = Router();

// RUTA CORRECTA: Usamos la raíz "/" porque el prefijo ya está en index.js
// Resultado final: /api/bulletins/123
router.get("/:id_enrollment", generateBulletinPDF);

export default router;