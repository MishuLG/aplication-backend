import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js"
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    deleteUserById, 
    updateUserById 
} from '../controllers/users.controllers.js';

const router = Router();


router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
 });
 router.get('/', (req, res) => {
    res.send('User route');
 });
router.get('/users', getAllUsers); 
router.get('/users/:id', getUserById); 
router.post('/users', createUser); 
router.delete('/users/:id', deleteUserById); 
router.put('/users/:id', updateUserById); 

export default router;