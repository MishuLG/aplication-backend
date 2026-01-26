import { Router } from "express";
import { 
  getAllEvaluations, 
  getEvaluationById, 
  createEvaluation, 
  updateEvaluationById, 
  deleteEvaluationById 
} from "../controllers/evaluations.controller.js";
import { authenticateToken } from "../middlewares/authenticate.token.js";

const router = Router();

// Protegemos todas las rutas
router.use(authenticateToken);

router.get("/", getAllEvaluations);
router.get("/:id", getEvaluationById);
router.post("/", createEvaluation);
router.put("/:id", updateEvaluationById);
router.delete("/:id", deleteEvaluationById);

export default router;