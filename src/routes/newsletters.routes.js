import { Router } from 'express';
import {
    getAllNewsletters,
    getNewsletterById,
    createNewsletter,
    updateNewsletterById,
    deleteNewsletterById
} from '../controllers/newsletters.controller.js';

const router = Router();

router.get('/', getAllNewsletters);               
router.get('/:id', getNewsletterById);          
router.post('/', createNewsletter);               
router.put('/:id', updateNewsletterById);        
router.delete('/:id', deleteNewsletterById);     

export default router;
