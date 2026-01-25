import { Router } from "express";
import { executePromotion } from "../controllers/promotion.controller.js";

// --- CORRECCIÓN DE IMPORTACIONES ---
// 1. Importamos 'authenticateToken' desde su archivo correcto (no verifyToken)
import { authenticateToken } from "../middlewares/authenticate.token.js";

// 2. Importamos 'isAdmin' para proteger esta ruta delicada
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Ruta protegida: Solo un usuario logueado (authenticateToken) y que sea Admin (isAdmin) puede ejecutarla
router.post("/execute-promotion", authenticateToken, isAdmin, executePromotion);

export default router;