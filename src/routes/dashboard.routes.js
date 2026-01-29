import { Router } from 'express';
import { getDashboardStats, getCarouselImages, updateCarouselImage } from '../controllers/dashboard.controller.js';
// CORRECCIÓN: Importamos 'authenticateToken' del archivo correcto, no 'verifyToken'
import { authenticateToken } from '../middlewares/authenticate.token.js'; 
import multer from 'multer';

const router = Router();

// Configuración de Multer (Almacenamiento en memoria para pasar a Sharp)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Usamos el nombre correcto del middleware
router.get('/dashboard', authenticateToken, getDashboardStats);

// --- NUEVAS RUTAS PARA EL CARRUSEL ---
// Se agregan bajo el prefijo /dashboard para mantener la estructura
router.get('/dashboard/carousel', authenticateToken, getCarouselImages);
router.post('/dashboard/carousel/:slot', authenticateToken, upload.single('image'), updateCarouselImage);

export default router;