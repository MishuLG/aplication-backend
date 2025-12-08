import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticate.token.js';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    validateProfessor,
    getUsersByRole
} from '../controllers/users.controllers.js';

const router = Router();

// Rutas de lectura (puedes protegerlas si deseas)
router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.get('/users/role/:role', authenticateToken, getUsersByRole);

// Rutas Críticas Protegidas con Token
router.post('/users', authenticateToken, createUser);
router.put('/users/:id', authenticateToken, updateUserById);
router.delete('/users/:id', authenticateToken, deleteUserById);

router.put('/users/validate-professor/:uid_users', authenticateToken, validateProfessor);

export default router;