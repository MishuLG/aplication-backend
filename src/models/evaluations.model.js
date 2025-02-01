import { pool } from '../database/db.js';

export const getAllEvaluationsModel = async () => {
    const query = `
        SELECT * FROM evaluations;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getEvaluationByIdModel = async (id) => {
    const query = `
        SELECT * FROM evaluations WHERE id_evaluations = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createEvaluationModel = async (evaluationData) => {
    const { id_student, id_subject, id_class_schedules, total_rating, date_evaluation, score, max_score, remarks, evaluation_type } = evaluationData;

    const query = `
        INSERT INTO evaluations (id_student, id_subject, id_class_schedules, total_rating, date_evaluation, score, max_score, remarks, evaluation_type, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *;
    `;
    const result = await pool.query(query, [
        id_student, id_subject, id_class_schedules, total_rating, date_evaluation, score, max_score, remarks, evaluation_type
    ]);
    return result.rows[0];
};

export const updateEvaluationByIdModel = async (id, evaluationData) => {
    const { id_student, id_subject, id_class_schedules, total_rating, date_evaluation, score, max_score, remarks, evaluation_type } = evaluationData;

    const query = `
        UPDATE evaluations SET 
            id_student = COALESCE($1, id_student),
            id_subject = COALESCE($2, id_subject),
            id_class_schedules = COALESCE($3, id_class_schedules),
            total_rating = COALESCE($4, total_rating),
            date_evaluation = COALESCE($5, date_evaluation),
            score = COALESCE($6, score),
            max_score = COALESCE($7, max_score),
            remarks = COALESCE($8, remarks),
            evaluation_type = COALESCE($9, evaluation_type),
            updated_at = NOW()
        WHERE id_evaluations = $10 RETURNING *;
    `;
    const result = await pool.query(query, [
        id_student, id_subject, id_class_schedules, total_rating, date_evaluation, score, max_score, remarks, evaluation_type, id
    ]);
    return result.rows[0];
};

export const deleteEvaluationByIdModel = async (id) => {
    const query = `DELETE FROM evaluations WHERE id_evaluations = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
