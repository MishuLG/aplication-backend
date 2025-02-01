import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    validateProfessor,
    deleteUserById,
    updateUserById,
    getUsersByRole
} from '../controllers/users.controllers.js';

const router = Router();

router.post('/users', createUser);                
router.get('/users', getAllUsers);                
router.get('/users/:id', getUserById);            
router.get('/users/role/:role', getUsersByRole);  
router.put('/users/validate/:uid_users', validateProfessor); 
router.put('/users/:id', updateUserById);         
router.delete('/users/:id', deleteUserById);      

export default router;