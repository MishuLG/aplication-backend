import { Router } from 'express';
import { login, logout, requestPasswordReset, resetPassword } from '../controllers/auth.controllers.js';
import { authenticateToken } from '../middlewares/authenticate.token.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/password-reset/request', requestPasswordReset);
router.post('/password-reset/reset', resetPassword);

export default router;
