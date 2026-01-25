import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUserById, 
    deleteUserById 
} from '../controllers/users.controllers.js';

// Importamos los middlewares
import { authenticateToken } from '../middlewares/authenticate.token.js';
import { isAdmin } from '../middlewares/auth.middleware.js'; // <--- NUEVO IMPORT

const router = Router();

// Rutas Públicas (o semi-públicas)
router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);

// Rutas Protegidas (SOLO ADMIN)
// El orden importa: Primero verifica token, luego verifica si es admin
router.post('/users', authenticateToken, isAdmin, createUser);
router.put('/users/:id', authenticateToken, isAdmin, updateUserById);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUserById); // <--- PROTEGIDO

export default router;