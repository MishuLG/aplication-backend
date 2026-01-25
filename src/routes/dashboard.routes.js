import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
// CORRECCIÓN: Importamos 'authenticateToken' del archivo correcto, no 'verifyToken'
import { authenticateToken } from '../middlewares/authenticate.token.js'; 

const router = Router();

// Usamos el nombre correcto del middleware
router.get('/dashboard', authenticateToken, getDashboardStats);

export default router;