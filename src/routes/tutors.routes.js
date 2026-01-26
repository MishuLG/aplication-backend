import { Router } from "express";
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor // <--- CORRECCIÓN: Usamos el nombre correcto
} from "../controllers/tutors.controller.js";
import { authenticateToken } from "../middlewares/authenticate.token.js";

const router = Router();

// Rutas protegidas
router.get("/", authenticateToken, getAllTutors);
router.get("/:id", authenticateToken, getTutorById);
router.post("/", authenticateToken, createTutor);
router.put("/:id", authenticateToken, updateTutor);
router.delete("/:id", authenticateToken, deleteTutor);

export default router;