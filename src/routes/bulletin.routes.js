import { Router } from "express";
import { generateBulletinPDF } from "../controllers/bulletin.controller.js";

const router = Router();

// Ruta: /api/bulletin/123 (donde 123 es el id_enrollment)
router.get("/bulletin/:id_enrollment", generateBulletinPDF);

export default router;