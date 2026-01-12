import { Router } from 'express';
import { 
    login, 
    logout, 
    requestPasswordReset, 
    resetPassword,
    getProfile,     
    updateProfile   
} from '../controllers/auth.controllers.js';
import { authenticateToken } from '../middlewares/authenticate.token.js'; 

const router = Router();

router.post('/login', login);
router.post('/logout', logout); 
router.post('/password-reset/request', requestPasswordReset); 
router.post('/password-reset/reset', resetPassword); 

// --- Rutas de Perfil (Protegidas) ---
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;