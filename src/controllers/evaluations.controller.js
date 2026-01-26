import { Evaluation, Student, Subject, ClassSchedule } from '../models/Sequelize/index.js';

// Función auxiliar para "traducir" de Sequelize (BD Nueva) a lo que espera el Frontend (Código Viejo)
const mapToFrontend = (evalItem) => {
    // Si el objeto viene vacío o nulo, retornamos null
    if (!evalItem) return null;
    
    // Convertimos a objeto plano si es una instancia de Sequelize
    const e = evalItem.toJSON ? evalItem.toJSON() : evalItem;

    return {
        id_evaluation: e.id_evaluations,         // BD: id_evaluations -> Front: id_evaluation
        id_student: e.id_student,
        id_subject: e.id_subject,
        id_class_schedules: e.id_class_schedules,
        evaluation_date: e.date_evaluation,      // BD: date_evaluation -> Front: evaluation_date
        evaluation_type: e.evaluation_type,
        score: e.score,
        max_score: e.max_score,
        total_grade: e.total_rating,             // BD: total_rating -> Front: total_grade
        observations: e.remarks,                 // BD: remarks -> Front: observations
        
        // Extras útiles (Datos del estudiante y materia)
        student_name: e.Student ? `${e.Student.first_name} ${e.Student.last_name}` : 'N/A',
        subject_name: e.Subject ? e.Subject.name_subject : 'N/A'
    };
};

export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({
            include: [
                { model: Student, attributes: ['first_name', 'last_name'] },
                { model: Subject, attributes: ['name_subject'] }
            ],
            order: [['date_evaluation', 'DESC']]
        });
        
        // Mapeamos todos los resultados al formato del frontend
        const formatted = evaluations.map(mapToFrontend);
        res.json(formatted);
    } catch (error) {
        console.error("Error getAllEvaluations:", error);
        res.status(500).json({ message: 'Error al obtener evaluaciones', error: error.message });
    }
};

export const getEvaluationById = async (req, res) => {
    try {
        const { id } = req.params;
        const evaluation = await Evaluation.findByPk(id, {
            include: [
                { model: Student },
                { model: Subject }
            ]
        });

        if (!evaluation) return res.status(404).json({ message: 'Evaluación no encontrada' });
        
        res.json(mapToFrontend(evaluation));
    } catch (error) {
        console.error("Error getEvaluationById:", error);
        res.status(500).json({ message: 'Error al obtener evaluación' });
    }
};

export const createEvaluation = async (req, res) => {
    // Recibimos los nombres del Frontend
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    // Validaciones básicas
    if (!id_student || !id_subject || !id_class_schedules || !evaluation_date || !evaluation_type || score === undefined || max_score === undefined) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (Number(score) > Number(max_score)) {
        return res.status(400).json({ message: 'La nota no puede ser mayor a la nota máxima.' });
    }

    try {
        // Verificar duplicados (Misma fecha, materia y estudiante)
        const exists = await Evaluation.findOne({
            where: {
                id_student,
                id_subject,
                date_evaluation: evaluation_date,
                evaluation_type
            }
        });

        if (exists) {
            return res.status(409).json({ message: 'Ya existe una evaluación igual para este estudiante en esta fecha.' });
        }

        // Crear usando los nombres de la BD Sequelize
        const newEval = await Evaluation.create({
            id_student,
            id_subject,
            id_class_schedules,
            date_evaluation: evaluation_date,   // Mapeo
            evaluation_type,
            score,
            max_score,
            total_rating: total_grade || score, // Mapeo
            remarks: observations               // Mapeo
        });

        res.status(201).json(mapToFrontend(newEval));
    } catch (error) {
        console.error("Error createEvaluation:", error);
        res.status(500).json({ message: 'Error al crear evaluación', error: error.message });
    }
};

export const updateEvaluationById = async (req, res) => {
    const { id } = req.params;
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    try {
        const evaluation = await Evaluation.findByPk(id);
        if (!evaluation) return res.status(404).json({ message: 'Evaluación no encontrada' });

        if (Number(score) > Number(max_score)) {
            return res.status(400).json({ message: 'La nota no puede superar la máxima.' });
        }

        // Actualizamos campos
        await evaluation.update({
            id_student: id_student || evaluation.id_student,
            id_subject: id_subject || evaluation.id_subject,
            id_class_schedules: id_class_schedules || evaluation.id_class_schedules,
            date_evaluation: evaluation_date || evaluation.date_evaluation,
            evaluation_type: evaluation_type || evaluation.evaluation_type,
            score: score !== undefined ? score : evaluation.score,
            max_score: max_score !== undefined ? max_score : evaluation.max_score,
            total_rating: total_grade !== undefined ? total_grade : evaluation.total_rating,
            remarks: observations !== undefined ? observations : evaluation.remarks
        });

        res.json(mapToFrontend(evaluation));
    } catch (error) {
        console.error("Error updateEvaluationById:", error);
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

export const deleteEvaluationById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Evaluation.destroy({ where: { id_evaluations: id } });
        if (!deleted) return res.status(404).json({ message: 'Evaluación no encontrada' });
        res.json({ message: 'Evaluación eliminada correctamente' });
    } catch (error) {
        console.error("Error deleteEvaluationById:", error);
        res.status(500).json({ message: 'Error al eliminar' });
    }
};