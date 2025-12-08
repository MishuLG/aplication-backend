import { pool } from '../database/db.js';

export const checkDuplicateEvaluationModel = async (studentId, subjectId, type, date, excludeId = null) => {
    let query = `
        SELECT evaluation_id 
        FROM evaluations 
        WHERE student_id = $1 
          AND subject_id = $2
          AND evaluation_type = $3
          AND evaluation_date = $4::date
    `;
    const params = [studentId, subjectId, type, date];
    if (excludeId) {
        query += ` AND evaluation_id != $5`;
        params.push(excludeId);
    }
    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const getAllEvaluationsModel = async () => {
    const query = `
        SELECT 
            e.evaluation_id AS id_evaluation,
            e.student_id AS id_student,
            e.subject_id AS id_subject,
            e.class_schedule_id AS id_class_schedules,
            TO_CHAR(e.evaluation_date, 'YYYY-MM-DD') AS evaluation_date,
            e.evaluation_type,
            e.score,
            e.max_score,
            e.total_grade,
            e.observations
        FROM evaluations e
        ORDER BY e.evaluation_date DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getEvaluationByIdModel = async (id) => {
    const query = `
        SELECT 
            e.evaluation_id AS id_evaluation,
            e.student_id AS id_student,
            e.subject_id AS id_subject,
            e.class_schedule_id AS id_class_schedules,
            TO_CHAR(e.evaluation_date, 'YYYY-MM-DD') AS evaluation_date,
            e.evaluation_type,
            e.score,
            e.max_score,
            e.total_grade,
            e.observations
        FROM evaluations e
        WHERE e.evaluation_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createEvaluationModel = async (data) => {
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = data;

    // Aseguramos que id_class_schedule se mapea correctamente a class_schedule_id ($3)
    const query = `
        INSERT INTO evaluations (
            student_id, 
            subject_id, 
            class_schedule_id, 
            evaluation_date, 
            evaluation_type, 
            score, 
            max_score, 
            total_grade, 
            observations
        )
        VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9)
        RETURNING 
            evaluation_id AS id_evaluation,
            student_id AS id_student,
            subject_id AS id_subject,
            class_schedule_id AS id_class_schedules,
            evaluation_date,
            score,
            total_grade;
    `;
    const result = await pool.query(query, [
        id_student, 
        id_subject, 
        id_class_schedules, // Este valor no puede ser null
        evaluation_date, 
        evaluation_type, 
        score, 
        max_score, 
        total_grade, 
        observations
    ]);
    return result.rows[0];
};

export const updateEvaluationByIdModel = async (id, data) => {
    const { 
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations 
    } = data;

    const query = `
        UPDATE evaluations SET 
            student_id = COALESCE($1, student_id),
            subject_id = COALESCE($2, subject_id),
            class_schedule_id = COALESCE($3, class_schedule_id),
            evaluation_date = COALESCE($4::date, evaluation_date),
            evaluation_type = COALESCE($5, evaluation_type),
            score = COALESCE($6, score),
            max_score = COALESCE($7, max_score),
            total_grade = COALESCE($8, total_grade),
            observations = COALESCE($9, observations)
        WHERE evaluation_id = $10
        RETURNING *;
    `;
    const result = await pool.query(query, [
        id_student, id_subject, id_class_schedules, 
        evaluation_date, evaluation_type, score, max_score, total_grade, observations, id
    ]);
    return result.rows[0];
};

export const deleteEvaluationByIdModel = async (id) => {
    const query = `DELETE FROM evaluations WHERE evaluation_id = $1 RETURNING evaluation_id;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};