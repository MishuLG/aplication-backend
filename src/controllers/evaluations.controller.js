import { Evaluation, Student, Subject, ClassSchedule } from '../models/Sequelize/index.js';

// --- HELPER: MAPEO DE BASE DE DATOS A FRONTEND ---
// Esto adapta los nombres de columnas de Sequelize a lo que usa tu React
const mapToFrontend = (evalItem) => {
    if (!evalItem) return null;
    
    // Si es instancia Sequelize, convertir a JSON
    const e = evalItem.toJSON ? evalItem.toJSON() : evalItem;

    return {
        id_evaluation: e.id_evaluations,         // PK
        id_student: e.id_student,
        id_subject: e.id_subject,
        id_class_schedules: e.id_class_schedules,
        
        evaluation_date: e.date_evaluation,      // DB: date_evaluation -> Front: evaluation_date
        evaluation_type: e.evaluation_type,
        score: parseFloat(e.score),
        max_score: parseFloat(e.max_score),
        total_grade: parseFloat(e.total_rating), // DB: total_rating -> Front: total_grade
        observations: e.remarks,                 // DB: remarks -> Front: observations
        
        // Datos adicionales para mostrar en tablas sin hacer más peticiones
        student_name: e.Student ? `${e.Student.first_name} ${e.Student.last_name}` : 'Estudiante no encontrado',
        subject_name: e.Subject ? e.Subject.name_subject : 'Materia desconocida',
        schedule_info: e.ClassSchedule ? `${e.ClassSchedule.day_of_week} ${e.ClassSchedule.start_time}` : ''
    };
};

// --- OBTENER TODAS ---
export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({
            include: [
                { model: Student, attributes: ['first_name', 'last_name'] },
                { model: Subject, attributes: ['name_subject'] },
                { model: ClassSchedule, attributes: ['day_of_week', 'start_time'] }
            ],
            order: [['date_evaluation', 'DESC']]
        });
        
        // Transformamos la data antes de enviarla
        const formatted = evaluations.map(mapToFrontend);
        res.json(formatted);
    } catch (error) {
        console.error("Error en getAllEvaluations:", error);
        res.status(500).json({ message: 'Error interno al obtener evaluaciones', error: error.message });
    }
};

// --- OBTENER UNA POR ID ---
export const getEvaluationById = async (req, res) => {
    try {
        const { id } = req.params;
        const evaluation = await Evaluation.findByPk(id, {
            include: [
                { model: Student },
                { model: Subject },
                { model: ClassSchedule }
            ]
        });

        if (!evaluation) return res.status(404).json({ message: 'Evaluación no encontrada' });
        
        res.json(mapToFrontend(evaluation));
    } catch (error) {
        console.error("Error en getEvaluationById:", error);
        res.status(500).json({ message: 'Error al obtener la evaluación' });
    }
};

// --- CREAR EVALUACIÓN ---
export const createEvaluation = async (req, res) => {
    // Extraemos datos con los nombres del formulario del Frontend
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    // 1. Validaciones de Campos Requeridos
    if (!id_student || !id_subject || !id_class_schedules || !evaluation_date || !evaluation_type) {
        return res.status(400).json({ message: 'Faltan campos obligatorios (Estudiante, Materia, Horario, Fecha o Tipo).' });
    }

    // 2. Validación Lógica de Notas
    if (Number(score) > Number(max_score)) {
        return res.status(400).json({ message: 'La nota obtenida no puede ser mayor a la nota máxima.' });
    }

    try {
        // 3. Verificar Duplicados (Mismo estudiante, misma materia, misma fecha y tipo)
        const exists = await Evaluation.findOne({
            where: {
                id_student,
                id_subject,
                date_evaluation: evaluation_date,
                evaluation_type
            }
        });

        if (exists) {
            return res.status(409).json({ message: 'Ya existe una evaluación idéntica registrada para este estudiante en esa fecha.' });
        }

        // 4. Crear Registro (Mapeando nombres de variables a columnas de la BD)
        const newEval = await Evaluation.create({
            id_student,
            id_subject,
            id_class_schedules,
            date_evaluation: evaluation_date,
            evaluation_type,
            score,
            max_score,
            total_rating: total_grade || score, // Si no envían total, usamos el score
            remarks: observations
        });

        res.status(201).json(mapToFrontend(newEval));

    } catch (error) {
        console.error("Error en createEvaluation:", error);
        res.status(500).json({ message: 'Error al guardar la evaluación', error: error.message });
    }
};

// --- ACTUALIZAR EVALUACIÓN ---
export const updateEvaluationById = async (req, res) => {
    const { id } = req.params;
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = req.body;

    try {
        const evaluation = await Evaluation.findByPk(id);
        if (!evaluation) return res.status(404).json({ message: 'Evaluación no encontrada' });

        // Validar lógica de notas si se están actualizando
        const finalScore = score !== undefined ? score : evaluation.score;
        const finalMax = max_score !== undefined ? max_score : evaluation.max_score;

        if (Number(finalScore) > Number(finalMax)) {
            return res.status(400).json({ message: 'La nota no puede superar la máxima permitida.' });
        }

        // Actualizar campos (Mapeo Front -> DB)
        await evaluation.update({
            id_student: id_student || evaluation.id_student,
            id_subject: id_subject || evaluation.id_subject,
            id_class_schedules: id_class_schedules || evaluation.id_class_schedules,
            date_evaluation: evaluation_date || evaluation.date_evaluation,
            evaluation_type: evaluation_type || evaluation.evaluation_type,
            score: finalScore,
            max_score: finalMax,
            total_rating: total_grade !== undefined ? total_grade : evaluation.total_rating,
            remarks: observations !== undefined ? observations : evaluation.remarks
        });

        res.json(mapToFrontend(evaluation));

    } catch (error) {
        console.error("Error en updateEvaluationById:", error);
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

// --- ELIMINAR EVALUACIÓN ---
export const deleteEvaluationById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Evaluation.destroy({ where: { id_evaluations: id } });
        
        if (!deleted) return res.status(404).json({ message: 'Evaluación no encontrada' });
        
        res.json({ message: 'Evaluación eliminada correctamente' });
    } catch (error) {
        console.error("Error en deleteEvaluationById:", error);
        res.status(500).json({ message: 'Error al eliminar la evaluación' });
    }
};