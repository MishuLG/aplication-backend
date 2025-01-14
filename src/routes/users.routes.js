import { Router } from "express";
import { 
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById 
} from '../controllers/users.controllers.js';

const router = Router();

router.get('/users', getAllUsers); 
router.get('/users:id', getUserById); 
router.post('/users', createUser); 
router.delete('/users:id', deleteUserById); 
router.put('/users:id', updateUserById); 

export default router;
