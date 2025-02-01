import { Router } from "express";
import { 
  getAllEvaluations, 
  getEvaluationsWithLeftJoin, 
  getEvaluationsWithRightJoin, 
  createEvaluation, 
  updateEvaluation, 
  deleteEvaluation 
} from "../controllers/evaluations.controller.js";

const router = Router();

router.get("/evaluations", getAllEvaluations);
router.get("/evaluations/left-join", getEvaluationsWithLeftJoin);
router.get("/evaluations/right-join", getEvaluationsWithRightJoin);
router.post("/evaluations", createEvaluation);
router.put("/evaluations/:id", updateEvaluation);
router.delete("/evaluations/:id", deleteEvaluation);

export default router;