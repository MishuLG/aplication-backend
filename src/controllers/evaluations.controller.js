import {
    getAllEvaluationsModel,
    getEvaluationByIdModel,
    createEvaluationModel,
    updateEvaluationByIdModel,
    deleteEvaluationByIdModel,
    checkDuplicateEvaluationModel
} from '../models/evaluations.model.js';

const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
};

export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await getAllEvaluationsModel();
        res.json(evaluations);
    } catch (error) {
        console.error("Error getAllEvaluations:", error);
        res.status(500).json({ message: 'Error al obtener evaluaciones', error: error.message });
    }
};

export const getEvaluationById = async (req, res) => {
    try {
        const evaluation = await getEvaluationByIdModel(req.params.id);
        if (!evaluation) return res.status(404).json({ message: 'Evaluación no encontrada' });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener evaluación' });
    }
};

export const createEvaluation = async (req, res) => {
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    if (!id_student || !id_subject || !id_class_schedules || !evaluation_date || !evaluation_type || score === undefined || max_score === undefined) {
        return res.status(400).json({ message: 'Faltan campos obligatorios. Verifique Horario y Tipo.' });
    }

    if (Number(score) > Number(max_score)) {
        return res.status(400).json({ message: 'La nota no puede ser mayor a la nota máxima.' });
    }
    if (isFutureDate(evaluation_date)) {
        return res.status(400).json({ message: 'La fecha no puede ser futura.' });
    }

    try {
        const isDuplicate = await checkDuplicateEvaluationModel(id_student, id_subject, evaluation_type, evaluation_date);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Ya existe una evaluación igual para este estudiante y fecha.' });
        }

        const newEval = await createEvaluationModel({
            id_student, id_subject, id_class_schedules, 
            evaluation_date, evaluation_type, score, max_score, total_grade, observations
        });
        res.status(201).json(newEval);
    } catch (error) {
        console.error("Error createEvaluation:", error);
        // Manejo de errores específicos de BD
        if (error.code === '23503') return res.status(400).json({ message: 'Estudiante, Materia u Horario no válidos.' });
        if (error.code === '23502') return res.status(400).json({ message: 'Faltan datos obligatorios (NULL en BD).' });
        if (error.code === '23514') return res.status(400).json({ message: 'El Tipo de Evaluación no es válido para la base de datos.' });
        
        res.status(500).json({ message: 'Error interno al crear evaluación', error: error.message });
    }
};

export const updateEvaluationById = async (req, res) => {
    const { id } = req.params;
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    if (!id_student || !id_subject || !id_class_schedules || !evaluation_date || !evaluation_type) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (parseFloat(score) > parseFloat(max_score)) {
        return res.status(400).json({ message: 'La nota no puede superar la máxima.' });
    }

    try {
        const isDuplicate = await checkDuplicateEvaluationModel(id_student, id_subject, evaluation_type, evaluation_date, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Conflicto: Ya existe otra evaluación idéntica.' });
        }

        const updatedEval = await updateEvaluationByIdModel(id, {
            id_student, id_subject, id_class_schedules, 
            evaluation_date, evaluation_type, score, max_score, total_grade, observations
        });

        if (!updatedEval) return res.status(404).json({ message: 'Evaluación no encontrada' });
        res.json(updatedEval);
    } catch (error) {
        console.error("Error updateEvaluationById:", error);
        if (error.code === '23514') return res.status(400).json({ message: 'Tipo de Evaluación inválido.' });
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

export const deleteEvaluationById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteEvaluationByIdModel(id);
        if (!deleted) return res.status(404).json({ message: 'Evaluación no encontrada' });
        res.json({ message: 'Evaluación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};