import { Router } from "express";
import { 
  getAllEvaluations, 
  getEvaluationById, 
  createEvaluation, 
  updateEvaluationById, 
  deleteEvaluationById 
} from "../controllers/evaluations.controller.js";

const router = Router();

router.get("/evaluations", getAllEvaluations);
router.get("/evaluations/:id", getEvaluationById);
router.post("/evaluations", createEvaluation);
router.put("/evaluations/:id", updateEvaluationById);
router.delete("/evaluations/:id", deleteEvaluationById);

export default router;