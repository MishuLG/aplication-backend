import { Router } from 'express';
import {
    getAllNewsletters,
    getNewsletterById,
    createNewsletter,
    updateNewsletterById,
    deleteNewsletterById
} from '../controllers/newsletters.controller.js';

const router = Router();

router.get('/newsletters', getAllNewsletters);               
router.get('/newsletters/:id', getNewsletterById);          
router.post('/newsletters', createNewsletter);               
router.put('/newsletters/:id', updateNewsletterById);        
router.delete('/newsletters/:id', deleteNewsletterById);     

export default router;
