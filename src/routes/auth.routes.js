import { Router } from 'express';
import { login, logout, requestPasswordReset, resetPassword } from '../controllers/auth.controllers.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout); 
router.post('/password-reset/request', requestPasswordReset); 
router.post('/password-reset/reset', resetPassword); 

export default router;
